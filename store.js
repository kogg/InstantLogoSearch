var applyMiddleware = require('redux').applyMiddleware;
var combineReducers = require('redux').combineReducers;
var createStore     = require('redux').createStore;
var feathersRedux   = require('./feathers-redux');
var thunkMiddlware  = require('redux-thunk');

createStore = applyMiddleware(thunkMiddlware)(createStore);
if (process.env.DEVTOOLS) {
	createStore = require('./components/DevTools').instrument()(createStore);
}

module.exports = function(state) {
	return createStore(combineReducers({
		messages: feathersRedux('message')
	}), state);
};
