var Provider = require('react-redux').Provider;
var React    = require('react');

var App      = require('./App');
var DevTools = process.env.DEVTOOLS && require('./DevTools');

module.exports = function(store) {
	return (
		<Provider store={store}>
			<div>
				<App />
				{DevTools && <DevTools />}
			</div>
		</Provider>
	);
};
