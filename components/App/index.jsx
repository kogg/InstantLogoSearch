var _       = require('underscore');
var connect = require('react-redux').connect;
var React   = require('react');

module.exports = connect(function(state) {
	return { messages: state.messages || [] };
})(React.createClass({
	render: function() {
		return (
			<div>
				{this.props.messages.map(function(message) {
					return (
						<div>{message}</div>
					);
				})}
			</div>
		);
	}
}));
