if (process.env.DEBUG) {
	localStorage.debug = process.env.DEBUG;
}
var debug    = require('debug')(process.env.npm_package_name + ':application');
var Provider = require('react-redux').Provider;
var React    = require('react');
var ReactDOM = require('react-dom');

var App   = require('./components/App');
var Store = require('./store');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(
	<Provider store={Store(state)}>
		<App />
	</Provider>,
	document.getElementById('react-app'),
	function() {
		debug('DOM rendered with state', state);
	}
);
