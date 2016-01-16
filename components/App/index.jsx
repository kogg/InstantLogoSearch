var _       = require('underscore');
var connect = require('react-redux').connect;
var React   = require('react');

var actions         = require('../../actions');
var feathersActions = require('../../feathers-actions');

var Message = React.createClass({
	render: function() {
		return <li>{this.props.message.text}</li>;
	}
});

module.exports = connect(function(state) {
	return {
		messages: _.chain(state)
			.result('messages')
			.result('items')
			.values()
			.pluck('data')
			.sortBy('date')
			.value()
	};
})(React.createClass({
	componentDidMount: function() {
		this.unsubscribe = feathersActions('message', { dispatch: this.props.dispatch, realtime: true });
		this.props.dispatch(actions.loadMessages());
	},
	componentWillUnmount: function() {
		this.unsubscribe();
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
