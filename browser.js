var _        = require('underscore');
var ReactDOM = require('react-dom');

var actions         = require('./actions');
var app             = require('./application');
var feathersActions = require('./feathers-actions');
var Root            = require('./components/Root');
var Store           = require('./store');

var store = Store(JSON.parse(document.getElementById('react-state').innerHTML));

_.extend(actions, feathersActions('message', app, { realtime: true, store: store }));

ReactDOM.render(Root(store), document.getElementById('react-app'));
