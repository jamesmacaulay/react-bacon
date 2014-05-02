var Bacon = require('baconjs');

module.exports.BaconMixin = ((function(){
  'use strict';

  function propsOrStateProperty(component, allPropsOrStateKey, groupKey, filterKey) {
    var bacon = component._bacon = component._bacon || {};
    var allPropertyKey = 'properties.'+allPropsOrStateKey;
    var groupedPropertiesKey = 'properties.'+groupKey;
    var property = bacon[allPropertyKey];
    if (!property) {
      var bus = bacon['buses.'+allPropsOrStateKey] = new Bacon.Bus();
      property = bacon[allPropertyKey] = bus.toProperty(component[groupKey]).skipDuplicates();
    }
    if (filterKey != null) {
      var wholePropsOrStateProperty = property;
      var filteredPropertyKey = groupedPropertiesKey+'.'+filterKey;
      property = bacon[filteredPropertyKey];
      if (!property) {
        property = bacon[filteredPropertyKey] = wholePropsOrStateProperty.
          filter(function(x){return x;}).
          map(function(propsOrState){
            return propsOrState[filterKey];
          }).
          skipDuplicates().
          toProperty();
      }
    }
    return property;
  }
  return ({
    propsProperty: function(propName) {
      return propsOrStateProperty(this, 'allProps', 'props', propName);
    },
    stateProperty: function(stateName) {
      return propsOrStateProperty(this, 'allState', 'state', stateName);
    },
    eventStream: function(eventName) {
      var bacon = this._bacon = this._bacon || {};
      var buses = bacon['buses.events'] = bacon['buses.events'] || {};
      var bus = buses[eventName];
      if (!bus) {
        bus = buses[eventName] = new Bacon.Bus();
        this[eventName] = function sendEventToStream(event) {
          bus.push(event);
        };
      }
      return bus;
    },
    plug: function(stream, stateKey) {
      var unsubscribe;
      var component = this;
      var bacon = this._bacon = this._bacon || {};
      var unsubscribers = bacon.unsubscribers = bacon.unsubscribers || [];

      if (stateKey == null) {
        unsubscribe = stream.onValue(function(partialState) {
          component.setState(partialState);
        });
      } else {
        unsubscribe = stream.onValue(function(value) {
          var partialState = {};
          partialState[stateKey] = value;
          component.setState(partialState);
        });
      }
      unsubscribers.push(unsubscribe);
      return unsubscribe;
    },
    componentDidUpdate: function() {
      var bacon = this._bacon;
      if (bacon) {
        var allPropsBus = bacon['buses.allProps'];
        allPropsBus && allPropsBus.push(this.props);
        var allStateBus = bacon['buses.allState'];
        allStateBus && allStateBus.push(this.state);
      }
    },
    componentWillUnmount: function() {
      var bacon = this._bacon;
      if (bacon) {
        var allPropsBus = bacon['buses.allProps'];
        allPropsBus && allPropsBus.end();
        var allStateBus = bacon['buses.allState'];
        allStateBus && allStateBus.end();

        var eventBuses = bacon['buses.events'];
        if (eventBuses) {
          for (var eventName in eventBuses) {
            eventBuses[eventName].end();
          }
        }

        var unsubscribers = bacon.unsubscribers;
        if (unsubscribers) {
          unsubscribers.forEach(function(f) {f()});
        }
      }
    }
  });
})());
