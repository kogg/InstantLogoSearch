var _               = require('underscore');
var combineReducers = require('redux').combineReducers;

module.exports = function(resource, state) {
	var RESOURCE = resource.toUpperCase();

	return combineReducers({
		loading: function(state, action) {
			switch (action.type) {
				case 'LOADING_' + RESOURCE + 'S':
					return true;
				case 'LOADED_' + RESOURCE + 'S':
					return false;
				default:
					return state || false;
			}
		},
		error: function(state, action) {
			switch (action.type) {
				case 'LOADING_' + RESOURCE + 'S':
					return null;
				case 'LOADED_' + RESOURCE + 'S':
					return action.error && action.payload;
				default:
					return state || null;
			}
		},
		items: function(state, action) {
			switch (action.type) {
				case 'LOADED_' + RESOURCE + 'S':
					return action.error ? state : _.indexBy(action.payload, 'id');
				case 'LOADING_' + RESOURCE:
				case 'CREATING_' + RESOURCE:
				case 'UDPATING_' + RESOURCE:
				case 'PATCHING_' + RESOURCE:
					state = _.clone(state);
					state[action.payload.id] = _.defaults({ loading: true, error: null }, state[action.payload.id]);
					return state;
				case 'LOADED_' + RESOURCE:
				case 'CREATED_' + RESOURCE:
				case 'UDPATED_' + RESOURCE:
				case 'PATCHED_' + RESOURCE:
					state = _.clone(state);
					state[action.payload.id] = _.defaults(
						{ loading: false, error: action.error && action.payload },
						action.error ? state[action.payload.id] : action.payload
					);
					return state;
				default:
					return state || {};
			}
		}
	}, state);
};
