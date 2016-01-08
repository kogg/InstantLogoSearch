var _       = require('underscore');
var connect = require('react-redux').connect;
var React   = require('react');

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
			.sortBy('date')
			.value()
	};
})(React.createClass({
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
