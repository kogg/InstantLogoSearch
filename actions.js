var _ = require('underscore');

var app;
var actions = {
	find: function(type, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'FINDING_' + type + 'S',
				payload: params
			});
			app.service('/api/' + type + 's').find(params, function(err, data) {
				dispatch({
					type:    'FOUND_' + type + 'S',
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	get: function(type, id, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'GETTING_' + type,
				payload: params
			});
			app.service('/api/' + type + 's').get(id, params, function(err, data) {
				dispatch({
					type:    'GOT_' + type,
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	create: function(type, data, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'CREATING_' + type,
				payload: params
			});
			app.service('/api/' + type + 's').create(data, params, function(err, data) {
				dispatch({
					type:    'CREATED_' + type,
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	update: function(type, id, data, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'UPDATING_' + type,
				payload: params
			});
			app.service('/api/' + type + 's').update(id, data, params, function(err, data) {
				dispatch({
					type:    'UPDATED_' + type,
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	patch: function(type, id, data, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'PATCHING_' + type,
				payload: params
			});
			app.service('/api/' + type + 's').patch(id, data, params, function(err, data) {
				dispatch({
					type:    'PATCHED_' + type,
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	remove: function(type, id, params) {
		type = type.toUpperCase();

		return function(dispatch) {
			dispatch({
				type:    'REMOVING_' + type,
				payload: params
			});
			app.service('/api/' + type + 's').remove(id, params, function(err, data) {
				dispatch({
					type:    'REMOVED_' + type,
					payload: err || data,
					error:   Boolean(err)
				});
			});
		};
	},
	setup: _.once(function(new_app, dispatch) {
		app = new_app;

		_.each(['message'], function(type) {
			var Type = type.charAt(0).toUpperCase() + type.slice(1);

			actions['find' + Type + 's'] = _.partial(actions.find, type);
			actions['get' + Type]        = _.partial(actions.get, type);
			actions['create' + Type]     = _.partial(actions.create, type);
			actions['update' + Type]     = _.partial(actions.update, type);
			actions['patch' + Type]      = _.partial(actions.patch, type);
			actions['remove' + Type]     = _.partial(actions.remove, type);
		});

		if (dispatch) {
			_.each(['message'], function(type) {
				var service = app.service('/api/' + type + 's');

				service.on('created', function(data) {
					dispatch({
						type:    'CREATED_' + type.toUpperCase(),
						payload: data
					});
				});

				service.on('updated', function(data) {
					dispatch({
						type:    'UPDATED_' + type.toUpperCase(),
						payload: data
					});
				});

				service.on('patched', function(data) {
					dispatch({
						type:    'PATCHED_' + type.toUpperCase(),
						payload: data
					});
				});

				service.on('removed', function(data) {
					dispatch({
						type:    'REMOVED_' + type.toUpperCase(),
						payload: data
					});
				});
			});
		}
	})
};

module.exports = actions;
