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
	server_actions: function(state, action) {
		switch (action.type) {
			case 'SERVER_ACTION':
				return _.chain(state)
					.union([action.payload])
					// TODO Unique based on something more granular
					.uniq(false, 'type')
					.value();
			default:
				return state || [];
		}
	},
	messages: feathersReducer('message')
}));
