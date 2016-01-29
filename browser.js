if (process.env.DEBUG) {
	localStorage.debug = process.env.DEBUG;
}
var debug    = require('debug')(process.env.npm_package_name + ':application');
var ReactDOM = require('react-dom');

var Root  = require('./components/Root');
var Store = require('./store');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(
	Root(Store(state)),
	document.getElementById('react-app'),
	function() {
		debug('DOM rendered with state', state);
	}
);
