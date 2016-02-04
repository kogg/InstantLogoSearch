var applyMiddleware      = require('redux').applyMiddleware;
var combineReducers      = require('redux').combineReducers;
var createBrowserHistory = require('history/lib/createBrowserHistory');
var createStore          = require('redux').createStore;
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

module.exports = function(state) {
	var store = createStore(combineReducers({
		routing:        routeReducer,
		server_actions: serverActionsReducer,
		messages:       resourcesReducer('message')
	}), state);

	if (process.browser) {
		reduxRouterMiddleware.listenForReplays(store);
	}

	return store;
};
