var IndexRoute = require('react-router').IndexRoute;
var React      = require('react');
var Route      = require('react-router').Route;

var App      = require('../components/App');
var Messages = require('../components/Messages');

module.exports = (
	<Route path="/" component={App}>
		<IndexRoute component={Messages}/>
	</Route>
);
