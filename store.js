var _               = require('underscore');
var applyMiddleware = require('redux').applyMiddleware;
var createStore     = require('redux').createStore;
var thunkMiddlware  = require('redux-thunk');

createStore = applyMiddleware(thunkMiddlware)(createStore);
if (process.env.DEVTOOLS) {
	createStore = require('./components/DevTools').instrument()(createStore);
}

module.exports = function(state) {
	return createStore(function(state, action) {
		switch (_.result(action, 'type')) {
			case 'LOADED_MESSAGES':
				return _.defaults({ messages: _.result(action, 'payload') }, state);
			case 'CREATED_MESSAGE':
				return _.defaults({ messages: _.union(state.messages || [], [_.result(action, 'payload')]) }, state);
			default:
				return state || { messages: [] };
		}
	}, state);
};
