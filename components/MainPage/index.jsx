var connect = require('react-redux').connect;
var React   = require('react');

var Logos = require('../Logos');

module.exports = connect()(React.createClass({
	render: function() {
		return <Logos history={this.props.history} />;
	}
}));
