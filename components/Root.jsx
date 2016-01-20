var FeathersMixin = require('feathers-react-redux').FeathersMixin;
var Provider      = require('react-redux').Provider;
var React         = require('react');

var actions  = require('../actions');
var app      = require('../application');
var App      = require('./App');
var DevTools = process.env.DEVTOOLS && require('./DevTools');

FeathersMixin.setFeathersApp(app);
FeathersMixin.setFeathersActions(actions);

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
