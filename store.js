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
		LOAD_COLLECTION: function(state) {
			return _.defaults(JSON.parse(global.localStorage.getItem('collection')) || {}, state);
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
}));
