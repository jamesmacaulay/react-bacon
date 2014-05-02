/** @jsx React.DOM */

var React = require('react/addons');
var Utils = React.addons.TestUtils;
var Bacon = require('baconjs');
var BaconMixin = require('react-bacon').BaconMixin;

describe('BaconMixin', function() {
  describe('#eventStream', function() {
    it('returns the stream for that defined name', function() {
      var stream;
      var Component = React.createClass({
        mixins: [BaconMixin],
        componentWillMount: function() {
          stream = this.eventStream('clicks');
        },
        render: function() {
          return <div />
        }
      });
      var component = Utils.renderIntoDocument(<Component />);
      expect(stream instanceof Bacon.EventStream).toBe(true);
    });

    it('returns always the same event stream', function() {
      var reference, anotherReference;
      var Component = React.createClass({
        mixins: [BaconMixin],
        componentWillMount: function() {
          reference = this.eventStream('clicks');
          anotherReference = this.eventStream('clicks');
        },
        render: function() {
          return <div />
        }
      });
      var component = Utils.renderIntoDocument(<Component />);
      expect(reference).toBe(anotherReference);
    });

    it('defines a function property with the name of the stream', function() {
      var Component = React.createClass({
        mixins: [BaconMixin],
        componentWillMount: function() {
          this.eventStream('clicks');
        },
        render: function() {
          return <div />
        }
      });

      var component = Utils.renderIntoDocument(<Component />);
      expect(component.clicks.constructor).toBe(Function);
    });

    it('that defined function can be used as event handler, and pushes to the stream', function() {
      var clickedDiv;
      var Component = React.createClass({
        mixins: [BaconMixin],
        componentWillMount: function() {
          this.eventStream('clicks').onValue(function() {
            clickedDiv = true;
          });
        },
        render: function() {
          return <div onClick={this.clicks}/>
        }
      });

      var component = Utils.renderIntoDocument(<Component />);
      var div = Utils.findRenderedDOMComponentWithTag(component, 'div');
      Utils.Simulate.click(div);

      expect(clickedDiv).toBe(true);
    });

    it('removes subscribers when the component unmounts', function() {
      var stream;
      var Component = React.createClass({
        mixins: [BaconMixin],
        componentWillMount: function() {
          stream = this.eventStream('clicks');
          stream.onValue(function() {
            // Does something
          });
        },
        render: function() {
          return <div onClick={this.clicks}/>
        }
      });

      var component = Utils.renderIntoDocument(<Component />);

      expect(stream.hasSubscribers()).toBe(true);

      var unmounted = React.unmountComponentAtNode(component.getDOMNode().parentNode);
      expect(unmounted).toBe(true);

      expect(stream.hasSubscribers()).toBe(false);
    });
  });
});
