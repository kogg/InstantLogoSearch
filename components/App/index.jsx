var _              = require('underscore');
var connect        = require('react-redux').connect;
var createSelector = require('reselect').createSelector;
var FeathersMixin  = require('feathers-react-redux').FeathersMixin;
var React          = require('react');

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
					return <li key={message.id}>{message.text}</li>;
				})}
			</ul>
		);
	}
}));
