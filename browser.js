/* global io */
var feathers = require('feathers-client');
var ReactDOM = require('react-dom');

var actions = require('./actions');
var Root    = require('./components/Root');
var Store   = require('./store');

var store = Store(JSON.parse(document.getElementById('react-state').innerHTML));

var app = feathers();
app.configure(feathers.socketio(io()));

actions.setup(app, store.dispatch);

ReactDOM.render(Root(store), document.getElementById('react-app'));
