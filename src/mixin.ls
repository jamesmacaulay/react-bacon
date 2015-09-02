Bacon = require \baconjs

ensure-unsub = ->
  it._bacon ?= {}
  it._bacon.unsub ?= []
ensure-buses = ->
  it._bacon ?= {}
  it._bacon.buses ?= {}
ensure-props = ->
  ensure-buses it .props ?= new Bacon.Bus!
ensure-state = ->
  ensure-buses it .state ?= new Bacon.Bus!

event-obj = -> "#{it.target.name}": it.target.value
event-bus = (it, name, generator) ->
  bus = ensure-buses it .["event_#name"] ?= new Bacon.Bus!
  if it[name] then throw "Cannot re-implement the event-bus end-point"
  it[name] = generator(bus)
  bus

module.exports =
  # offer a bacon event stream for the component's properties.
  stream-props : (pn) -> unless pn? then ensure-props @ else ensure-props @ .map -> it[pn]
  # offer a bacon event stream for the component's state.
  stream-state : (sn) -> unless sn? then ensure-state @ else ensure-state @ .map -> it[sn]
  # register a callback hook and offer a stream on the other end of it.
  event-stream : (en) -> event-bus @, en, (bus) -> !-> bus.push it
  # similar to event-stream except we push it.target.value through the stream.
  value-stream : (en) -> event-bus @, en, (bus) -> !-> bus.push it.target.value
  # similar to event-stream except we push {it.target.name : it.target.value} through.
  input-stream : (en) -> event-bus @, en, (bus) -> !-> bus.push (it |> event-obj)
  # similar to event-stream except we bother to prevent event propagation.
  dom-event-stream : (en, prevent-default, stop-propagation) -> event-bus @, en, (bus) -> !->
      it.prevent-default!  if !!prevent-default  and it.prevent-default?
      it.stop-propagation! if !!stop-propagation and it.stop-propagation?
      bus.push it
  # links the unsub function to the component's lifecycle.
  # unsub will be run in component-will-unmount.
  subscribe-to : (unsub) -> ensure-unsub @ .push unsub; unsub
  # plugs a stream into the components state.
  # either under a specific key, or overriding the entire state object.
  plug : (stream, key) ->
    @subscribe-to stream.on-value do
      if key? then !~> @set-state "#key": it else !~> @set-state it
  # push values to the props and state streams if they exist.
  component-did-update : !->
    if @_bacon?buses?
      @_bacon.buses.props?push @props
      @_bacon.buses.state?push @state
  # cleanup whenever the component unmounts.
  component-will-unmount : !->
    if @_bacon?
      if @_bacon.buses?
        for b of @_bacon.buses
          @_bacon.buses[b].end!
      @_bacon.unsub?for-each !-> it!
      @_bacon = {}
