### _This project is no longer maintained_

It probably still works, but maybe not for long with the latest versions of React and/or Bacon.js. It's not a lot of code, so I encourage you to fork the project and turn it into exactly what you need.

If you'd like to take over maintenance of this project, feel free to get in touch either over [twitter](https://twitter.com/jamesmacaulay) or by [opening an issue](https://github.com/jamesmacaulay/react-bacon/issues/new).

# react-bacon

A little module for using [React](http://facebook.github.io/) with [Bacon.js](http://baconjs.github.io/).

Here's [a JSFiddle](http://jsfiddle.net/jamesmacaulay/Wc7bb/)!

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

### component.plug(observable, _[stateKey]_)

Plugs a Bacon observable into the component's state, and returns an unsubscribe function. If a `stateKey` is given, then values from the observable are assigned to the given key. If no `stateKey` is given, the values must be objects which are passed directly to `setState` to assign multiple state keys at once.

The component will unsubscribe from the stream when it unmounts.

## Packaging

```
browserify --standalone ReactBacon src/react-bacon.js -o dist/react-bacon.js
```
