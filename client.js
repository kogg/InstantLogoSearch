/* global io */
var feathers = require('feathers-client');
var ReactDOM = require('react-dom');

var Root  = require('./components/Root');
var Store = require('./store');

var app = feathers();
app.configure(feathers.socketio(io()));

var state = JSON.parse(document.getElementById('react-state').innerHTML);

ReactDOM.render(Root(Store(state)), document.getElementById('react-app'));
