var feathers = require('feathers-client');

var app = feathers();
/* global io */
app.configure(feathers.socketio(io()));
/* global io:false */

module.exports = app;
