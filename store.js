var _                    = require('underscore');
var applyMiddleware      = require('redux').applyMiddleware;
var combineReducers      = require('redux').combineReducers;
var createStore          = require('redux').createStore;
var handleActions        = require('redux-actions').handleActions;
var resourcesReducer     = require('feathers-react-redux').resourcesReducer;
var serverActionsReducer = require('feathers-react-redux').serverActionsReducer;
var thunkMiddlware       = require('redux-thunk').default;

if (global.window && global.window.devToolsExtension) {
	createStore = global.window.devToolsExtension()(createStore);
}
createStore = applyMiddleware(thunkMiddlware)(createStore);

function reduceToStorage(key, reducer) {
	return function(state, action) {
		var val = reducer(state, action);
		try {
			global.localStorage.setItem(key, JSON.stringify(val));
		} catch (err) {
			switch (err.name) {
				case 'QuotaExceededError':
					break;
				default:
					throw err;
			}
		}
		return val;
	};
}

module.exports = function(state) {
	var store = createStore(combineReducers({
		server_actions: serverActionsReducer,
		logos:          resourcesReducer('logo'),
		collection:     handleActions({
			LOAD_LOCAL_STORAGE: function(state) {
				try {
					return global.localStorage ? JSON.parse(global.localStorage.getItem('collection')) || state || {} : state;
				} catch (err) {
					switch (err.name) {
						case 'QuotaExceededError':
						case 'SyntaxError':
							return state || {};
						default:
							throw err;
					}
				}
			},
			CLEAR_COLLECTION:  reduceToStorage('collection', _.constant({})),
			ADD_TO_COLLECTION: reduceToStorage('collection', function(state, action) {
				var new_state = _.clone(state || {});
				new_state[action.payload.id] = true;
				return new_state;
			}),
			REMOVE_FROM_COLLECTION: reduceToStorage('collection', function(state, action) {
				var new_state = _.clone(state || {});
				delete new_state[action.payload.id];
				return new_state;
			})
		}, null),
		considering: handleActions({
			CONSIDER_LOGO: function(state, action) {
				return action.payload.id || state;
			},
			UNCONSIDER_LOGO: function(state, action) {
				return (action.payload.id === state) ? null : state;
			}
		}, null),
		searching: handleActions({
			SEARCH: function(state, action) {
				return action.payload || '';
			}
		}, ''),
		untilPopup: handleActions({
			LOAD_LOCAL_STORAGE: function(state) {
				try {
					return global.localStorage ? JSON.parse(global.localStorage.getItem('untilPopup')) || state || {} : state;
				} catch (err) {
					switch (err.name) {
						case 'QuotaExceededError':
						case 'SyntaxError':
							return state || {};
						default:
							throw err;
					}
				}
			},
			DOWNLOADED: reduceToStorage('untilPopup', function(state, action) {
				return state - (action.payload || 1);
			}),
			RESET_DOWNLOADED: reduceToStorage('untilPopup', function() {
				return 10;
			})
		}, 3)
	}), state);

	return store;
};
