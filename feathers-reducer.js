var _               = require('underscore');
var combineReducers = require('redux').combineReducers;

var resourceReducer = function(resource, state) {
	var RESOURCE = resource.toUpperCase();

	return combineReducers({
		loading: function(state, action) {
			if (!action.payload || !action.payload.id) {
				return state || false;
			}
			switch (action.type) {
				case 'LOADING_' + RESOURCE:
					return true;
				case 'LOADED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		updating: function(state, action) {
			if (!action.payload || !action.payload.id) {
				return state || false;
			}
			switch (action.type) {
				case 'UDPATING_' + RESOURCE:
				case 'PATCHING_' + RESOURCE:
					return true;
				case 'UDPATED_' + RESOURCE:
				case 'PATCHED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		removing: function(state, action) {
			if (!action.payload || !action.payload.id) {
				return state || false;
			}
			switch (action.type) {
				case 'REMOVING_' + RESOURCE:
					return true;
				case 'REMOVED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		error: function(state, action) {
			if (!action.payload || !action.payload.id) {
				return state || null;
			}
			switch (action.type) {
				case 'LOADING_' + RESOURCE:
				case 'UDPATING_' + RESOURCE:
				case 'PATCHING_' + RESOURCE:
				case 'REMOVING_' + RESOURCE:
					return null;
				case 'LOADED_' + RESOURCE:
				case 'UDPATED_' + RESOURCE:
				case 'PATCHED_' + RESOURCE:
				case 'REMOVED_' + RESOURCE:
					return action.error ? action.payload : null;
				default:
					return state || null;
			}
		},
		data: function(state, action) {
			if (!action.payload || !action.payload.id) {
				return state || null;
			}
			switch (action.type) {
				case 'LOADED_' + RESOURCE:
				case 'CREATED_' + RESOURCE:
				case 'UDPATED_' + RESOURCE:
				case 'PATCHED_' + RESOURCE:
					return action.error ? state : action.payload;
				case 'REMOVED_' + RESOURCE:
					return null;
				default:
					return state || {};
			}
		}
	}, state);
};

var resourcesReducer = function(resource, state) {
	var RESOURCE = resource.toUpperCase();

	var singleItemReducer = resourceReducer(resource, {});

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
		creating: function(state, action) {
			switch (action.type) {
				case 'CREATING_' + RESOURCE:
					return true;
				case 'CREATED_' + RESOURCE:
					return false;
				default:
					return state || false;
			}
		},
		error: function(state, action) {
			switch (action.type) {
				case 'LOADING_' + RESOURCE + 'S':
				case 'CREATING_' + RESOURCE:
					return null;
				case 'LOADED_' + RESOURCE + 'S':
				case 'CREATED_' + RESOURCE:
					return action.error ? action.payload : null;
				default:
					return state || null;
			}
		},
		items: function(state, action) {
			switch (action.type) {
				case 'LOADED_' + RESOURCE + 'S':
					return action.error ? state : _.indexBy(action.payload, 'id');
				case 'REMOVED_' + RESOURCE:
					state = _.clone(state);
					if (action.error) {
						state[action.payload.id] = singleItemReducer(state[action.payload.id] || { id: action.payload.id }, action);
					} else {
						delete state[action.payload.id];
					}
					return state || {};
				default:
					if (!action.payload || !action.payload.id) {
						return state || {};
					}
					state = _.clone(state);
					state[action.payload.id] = singleItemReducer(state[action.payload.id], action);
					return state || {};
			}
		}
	}, state);
};

module.exports = function(resource, options, state) {
	return options.id ? resourceReducer(resource, state) : resourcesReducer(resource, state);
};
module.exports.resourceReducer  = resourceReducer;
module.exports.resourcesReducer = resourcesReducer;
