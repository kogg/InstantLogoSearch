var _ = require('underscore');

module.exports = function(resource_type) {
	resource_type = resource_type.toUpperCase();

	return function(state, action) {
		state = state || { items: {}, creating: {} };

		switch (action.type) {
			case 'LOADING_' + resource_type + 'S':
				return _.defaults({ loading: true }, state);
			case 'LOADED_' + resource_type + 'S':
				return _.defaults(
					action.error ?
						{ loading: { error: action.payload } } :
						{
							loading: false,
							items:   _.chain(action.payload)
								.indexBy('id')
								.defaults(state.items)
								.value()
						},
					state
				);
			case 'LOADING_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = _.defaults({ loading: true, id: action.payload.id }, state.items[action.payload.id]);
				return state;
			case 'LOADED_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = action.error ?
					_.defaults({ loading: { error: action.payload } }, state.items[action.payload.id]) :
					action.payload;
				return state;
			case 'CREATING_' + resource_type:
				state = _.defaults({ creating: _.clone(state.creating) }, state);
				state.creating[state.payload._create_id] = _.omit(action.payload, '_create_id');
				return state;
			case 'CREATED_' + resource_type:
				state = _.defaults({ creating: _.clone(state.creating), items: _.clone(state.items) }, state);
				if (action.error) {
					state.creating[state.payload._create_id] = _.defaults({ error: state.payload }, state.creating[state.payload._create_id]);
					return state;
				}
				if (action.payload._create_id) {
					delete state.creating[action.payload._create_id];
				}
				state.items[action.payload.id] = _.omit(action.payload, '_create_id');
				return state;
			case 'UPDATING_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = _.defaults({ updating: { item: action.payload }, id: action.payload.id }, state.items[action.payload.id]);
				return state;
			case 'UPDATED_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = action.error ?
					_.defaults({ updating: { error: action.payload } }, state.items[action.payload.id]) :
					action.payload;
				return state;
			case 'PATCHING_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = _.defaults({ patching: { item: action.payload }, id: action.payload.id }, state.items[action.payload.id]);
				return state;
			case 'PATCHED_' + resource_type:
				state = _.defaults({ items: _.clone(state.items) }, state);
				state.items[action.payload.id] = action.error ?
					_.defaults({ patching: { error: action.payload } }, state.items[action.payload.id]) :
					action.payload;
				return state;
			default:
				return state;
		}
	};
};
