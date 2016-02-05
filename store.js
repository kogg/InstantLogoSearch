var _                    = require('underscore');
var applyMiddleware      = require('redux').applyMiddleware;
var combineReducers      = require('redux').combineReducers;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var createStore          = require('redux').createStore;
var handleActions        = require('redux-actions').handleActions;
var resourcesReducer     = require('feathers-react-redux').resourcesReducer;
var routeReducer         = require('react-router-redux').routeReducer;
var serverActionsReducer = require('feathers-react-redux').serverActionsReducer;
var syncHistory          = require('react-router-redux').syncHistory;
var thunkMiddlware       = require('redux-thunk');

if (global.window && global.window.devToolsExtension) {
	createStore = global.window.devToolsExtension()(createStore);
}
var reduxRouterMiddleware = syncHistory(global.window ? createBrowserHistory() : require('history/lib/createMemoryHistory')());
createStore = applyMiddleware(thunkMiddlware, reduxRouterMiddleware)(createStore);

function reduceToStorage(key, reducer) {
	return function(state, action) {
		var val = reducer(state, action);
		global.localStorage.setItem(key, JSON.stringify(val));
		return val;
	};
}

module.exports = function(state) {
	var store = createStore(combineReducers({
		routing:        routeReducer,
		server_actions: serverActionsReducer,
		logos:          resourcesReducer('logo'),
		considering:    handleActions({
			CONSIDER_LOGO: function(state, action) {
				return action.payload.id || state;
			},
			UNCONSIDER_LOGO: function(state, action) {
				return (action.payload.id === state) ? null : state;
			}
		}, null),
		collection: handleActions({
			LOAD_COLLECTION: function() {
				return global.localStorage ? JSON.parse(global.localStorage.getItem('collection')) || {} : {};
			},
			CLEAR_COLLECTION:  reduceToStorage('collection', _.constant({})),
			ADD_TO_COLLECTION: reduceToStorage('collection', function(state, action) {
				var new_state = _.clone(state);
				new_state[action.payload.id] = true;
				return new_state;
			}),
			REMOVE_FROM_COLLECTION: reduceToStorage('collection', function(state, action) {
				var new_state = _.clone(state);
				delete new_state[action.payload.id];
				return new_state;
			})
		}, {})
	}), state);

	if (process.browser) {
		reduxRouterMiddleware.listenForReplays(store);
	}

	return store;
};
