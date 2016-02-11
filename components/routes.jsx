var IndexRoute = require('react-router').IndexRoute;
var React      = require('react');
var Route      = require('react-router').Route;

var App           = require('./App');
var MainPage      = require('./MainPage');
var ShortnamePage = require('./ShortnamePage');

module.exports = (
	<Route path="/" component={App}>
		<IndexRoute component={MainPage} />
		<Route path=":shortname" component={ShortnamePage} />
	</Route>
);
