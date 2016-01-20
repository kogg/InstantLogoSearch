var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var React          = require('react');

var FeathersMixin = require('../FeathersMixin');

var Message = React.createClass({
	render: function() {
		return <li>{this.props.message.text}</li>;
	}
});

module.exports = connect(createSelector(
	_.property('messages'),
	function(messages) {
		return {
			messages: _.chain(messages)
				.values()
				.pluck('data')
				.sortBy('date')
				.value()
		};
	}
))(React.createClass({
	mixins:             [FeathersMixin],
	componentWillMount: function() {
		this.feathers('message', { client_load: true, realtime: true });
	},
	render: function() {
		return (
			<ul>
				{this.props.messages.map(function(message) {
					return <Message key={message.id} message={message} />;
				})}
			</ul>
		);
	}
}));
