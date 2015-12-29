var _       = require('underscore');
var connect = require('react-redux').connect;
var React   = require('react');

module.exports = connect(_.partial(_.pick, _, 'message'))(React.createClass({
	render: function() {
		return <div>{this.props.message}</div>;
	}
}));
