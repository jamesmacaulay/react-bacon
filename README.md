# react-bacon

A little module for using [React](http://facebook.github.io/) with [Bacon.js](http://baconjs.github.io/).

## Installation

For [browserify](http://browserify.org/) projects, `npm install --save react-bacon`.

For other projects, use the [UMD](https://github.com/umdjs/umd) distribution in [/dist/react-bacon.js](https://raw.githubusercontent.com/jamesmacaulay/react-bacon/master/dist/react-bacon.js).

If you are just putting it in a `<script>` tag, the library will be at `window.ReactBacon`.

## Usage

Right now the library includes a single React mixin, `BaconMixin`.

`BaconMixin` provides a few different methods for your components:

### component.propsProperty(_[propName]_)

Returns a memoized `Bacon.Property` backed by the component's props, skipping duplicate values. When a `propName` is present, the values of the property are those of the given prop. If no `propName` is given, the property's values are the whole props objects of the component.

The properties returned are cleaned up with a `Bacon.End` when the component unmounts.

### component.stateProperty(_[stateName]_)

Like `propsProperty(propName)`, but for state values.

### component.eventStream(functionName)

Registers an event handler function on the component with the given name, which simply sends its argument to the returned Bacon stream.

The stream is memoized by the `functionName`, and gets cleaned up with a `Bacon.End` when the component unmounts.

### component.plug(stream, _[stateKey]_)

Plugs a Bacon observable into the component's state, and returns an unsubscribe function. If a `stateKey` is given, then values from the observable are assigned to the given key. If no `stateKey` is given, the values must be whole state objects (assigned with `setState`, not `replaceState`).

The component will unsubscribe from the stream when it unmounts.
