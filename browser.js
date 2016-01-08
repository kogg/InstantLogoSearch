/* global io */
var feathers = require('feathers-client');
var ReactDOM = require('react-dom');

var Root  = require('./components/Root');
var Store = require('./store');

var app = feathers();
app.configure(feathers.socketio(io()));

var store = Store(JSON.parse(document.getElementById('react-state').innerHTML));

ReactDOM.render(Root(store), document.getElementById('react-app'));
