var Provider = require('react-redux').Provider;
var React    = require('react');

var App      = require('./components/App');
var DevTools = process.env.DEVTOOLS && require('./components/DevTools');

module.exports = function(store) {
	return DevTools ? (
		<Provider store={store}>
			<div>
				<App />
				<DevTools />
			</div>
		</Provider>
	) : (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
