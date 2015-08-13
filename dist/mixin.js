var Bacon, ensureUnsub, ensureBuses, ensureProps, ensureState, eventObj, eventBus;
Bacon = require('baconjs');
ensureUnsub = function(it){
  var ref$, ref1$;
  it._bacon == null && (it._bacon = {});
  return (ref1$ = (ref$ = it._bacon).unsub) != null
    ? ref1$
    : ref$.unsub = [];
};
ensureBuses = function(it){
  var ref$, ref1$;
  it._bacon == null && (it._bacon = {});
  return (ref1$ = (ref$ = it._bacon).buses) != null
    ? ref1$
    : ref$.buses = {};
};
ensureProps = function(it){
  var ref$, ref1$;
  return (ref1$ = (ref$ = ensureBuses(it)).props) != null
    ? ref1$
    : ref$.props = new Bacon.Bus();
};
ensureState = function(it){
  var ref$, ref1$;
  return (ref1$ = (ref$ = ensureBuses(it)).state) != null
    ? ref1$
    : ref$.state = new Bacon.Bus();
};
eventObj = function(it){
  var ref$;
  return ref$ = {}, ref$[it.target.name + ""] = it.target.value, ref$;
};
eventBus = function(it, name, generator){
  var bus, ref$, key$, ref1$;
  bus = (ref1$ = (ref$ = ensureBuses(it))[key$ = "event_" + name]) != null
    ? ref1$
    : ref$[key$] = new Bacon.Bus();
  if (it[name]) {
    throw "Cannot re-implement the event-bus end-point";
  }
  it[name] = generator(bus);
  return bus;
};
module.exports = {
  streamProps: function(pn){
    if (pn != null) {
      return ensureProps(this);
    } else {
      return ensureProps(this).map(function(it){
        return it[pn];
      });
    }
  },
  streamState: function(sn){
    if (sn != null) {
      return ensureState(this);
    } else {
      return ensureState(this).map(function(it){
        return it[sn];
      });
    }
  },
  eventStream: function(en){
    return eventBus(this, en, function(bus){
      return function(it){
        bus.push(it);
      };
    });
  },
  valueStream: function(en){
    return eventBus(this, en, function(bus){
      return function(it){
        bus.push(it.target.value);
      };
    });
  },
  inputStream: function(en){
    return eventBus(this, en, function(bus){
      return function(it){
        bus.push(eventObj(
        it));
      };
    });
  },
  domEventStream: function(en, preventDefault, stopPropagation){
    return eventBus(this, en, function(bus){
      return function(it){
        if (preventDefault && it.preventDefault != null) {
          it.preventDefault();
        }
        if (stopPropagation && it.stopPropagation != null) {
          it.stopPropagation();
        }
        bus.push(it);
      };
    });
  },
  subscribeTo: function(unsub){
    ensureUnsub(this).push(unsub);
    return unsub;
  },
  plug: function(stream, key){
    var this$ = this;
    return this.subscribeTo(stream.onValue(key != null
      ? function(it){
        var ref$;
        this$.setState((ref$ = {}, ref$[key + ""] = it, ref$));
      }
      : function(it){
        this$.setState(it);
      }));
  },
  componentDidUpdate: function(){
    var ref$, ref1$, ref2$;
    if (((ref$ = this._bacon) != null ? ref$.buses : void 8) != null) {
      if ((ref1$ = this._bacon.buses.props) != null) {
        ref1$.push(this.props);
      }
      if ((ref2$ = this._bacon.buses.state) != null) {
        ref2$.push(this.state);
      }
    }
  },
  componentWillUnmount: function(){
    var b, ref$;
    if (this._bacon != null) {
      if (this._bacon.buses != null) {
        for (b in this._bacon.buses) {
          this._bacon.buses[b].end();
        }
      }
      if ((ref$ = this._bacon.unsub) != null) {
        ref$.forEach(function(it){
          it();
        });
      }
      this._bacon = {};
    }
  }
};
//# sourceMappingURL=maps/mixin.js.map