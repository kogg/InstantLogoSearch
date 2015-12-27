var React    = require('react');
var ReactDOM = require('react-dom');
var App      = require('./components/App');

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(
	<App message={state.message} />,
	document.getElementById('react-app')
);
