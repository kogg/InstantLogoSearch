var React = require('react');
var App   = require('./components/App');

module.exports = function(state) {
	return <App message={state.message} />;
};
