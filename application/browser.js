var feathers = require('feathers-client');

var app = feathers();
if (process.env.npm_package_feathersjs_socket) {
	/* global io */
	app.configure(feathers.socketio(io()));
	/* global io:false */
}

module.exports = app;
