if (process.env.DEBUG) {
	localStorage.debug = process.env.DEBUG;
}
var _                    = require('underscore');
var createBrowserHistory = require('history/lib/createBrowserHistory');
var debug                = require('debug')(process.env.npm_package_name + ':application');
var Provider             = require('react-redux').Provider;
var React                = require('react');
var ReactDOM             = require('react-dom');
var Router               = require('react-router').Router;

var routes = require('./components/routes');
var Store  = require('./store');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

global.ga = global.ga || _.noop;

ReactDOM.render(
	<Provider store={Store(state)}>
		<Router history={createBrowserHistory()} routes={routes} />
	</Provider>,
	document.getElementById('react-app'),
	function() {
		debug('DOM rendered with state', state);
	}
);
