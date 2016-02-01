var _                    = require('underscore');
var applyMiddleware      = require('redux').applyMiddleware;
var combineReducers      = require('redux').combineReducers;
var createStore          = require('redux').createStore;
var handleActions        = require('redux-actions').handleActions;
var resourcesReducer     = require('feathers-react-redux').resourcesReducer;
var serverActionsReducer = require('feathers-react-redux').serverActionsReducer;
var thunkMiddlware       = require('redux-thunk');

if (process.env.DEVTOOLS) {
	createStore = require('./components/DevTools').instrument()(createStore);
}
createStore = applyMiddleware(thunkMiddlware)(createStore);

function reduceToStorage(key, reducer) {
	return function(state, action) {
		var val = reducer(state, action);
		global.localStorage.setItem(key, JSON.stringify(val));
		return val;
	};
}

module.exports = _.partial(createStore, combineReducers({
	server_actions: serverActionsReducer,
	logos:          resourcesReducer('logo'),
	collection:     handleActions({
		LOAD_COLLECTION: function() {
			return global.localStorage ? JSON.parse(global.localStorage.getItem('collection')) || [] : [];
		},
		CLEAR_COLLECTION:  reduceToStorage('collection', _.constant([])),
		ADD_TO_COLLECTION: reduceToStorage('collection', function(state, action) {
			return _.union(state, [action.payload.id]);
		}),
		REMOVE_FROM_COLLECTION: reduceToStorage('collection', function(state, action) {
			return _.without(state, action.payload.id);
		})
	}, [])
}));
