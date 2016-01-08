/* global io */
var feathers = require('feathers-client');
var ReactDOM = require('react-dom');

var WebApp = require('./webapp');

var app = feathers();
app.configure(feathers.socketio(io()));

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(WebApp(state, app), document.getElementById('react-app'));
