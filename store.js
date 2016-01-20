var _               = require('underscore');
var applyMiddleware = require('redux').applyMiddleware;
var combineReducers = require('redux').combineReducers;
var createStore     = require('redux').createStore;
var thunkMiddlware  = require('redux-thunk');

var feathersReducer = require('./feathers-reducer');

if (process.env.DEVTOOLS) {
	createStore = require('./components/DevTools').instrument()(createStore);
}
createStore = applyMiddleware(thunkMiddlware)(createStore);

module.exports = _.partial(createStore, combineReducers({
	messages: feathersReducer('message')
}));
