var feathers = require('feathers-client');

var app = feathers(document.location.origin);
if (process.env.npm_package_feathersjs_socket) {
	/* global io */
	app.configure(feathers.socketio(io()));
	/* global io:false */
} else {
	if (!global.fetch) {
		require('whatwg-fetch');
	}
	app.configure(feathers.fetch(global.fetch));
}

module.exports = app;
