var _            = require('underscore');
var createAction = require('redux-actions').createAction;
var pluralize    = require('pluralize');

var actions = require('./actions');
var app     = require('./application');

var done_for = {};

module.exports = function(resource, options) {
	var RESOURCE  = resource.toUpperCase();
	var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
	var resources = pluralize(resource);
	var RESOURCES = resources.toUpperCase();
	var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

	var createdResource  = createAction('CREATED_' + RESOURCE);
	var updatedResource  = createAction('UPDATED_' + RESOURCE);
	var patchedResource  = createAction('PATCHED_' + RESOURCE);
	var removedResource  = createAction('REMOVED_' + RESOURCE);

	if (!done_for[resource]) {
		var loadingResources = createAction('LOADING_' + RESOURCES);
		var loadedResources  = createAction('LOADED_' + RESOURCES);
		var loadingResource  = createAction('LOADING_' + RESOURCE);
		var loadedResource   = createAction('LOADED_' + RESOURCE);
		var creatingResource = createAction('CREATING_' + RESOURCE);
		var updatingResource = createAction('UPDATING_' + RESOURCE);
		var patchingResource = createAction('PATCHING_' + RESOURCE);
		var removingResource = createAction('REMOVING_' + RESOURCE);

		actions['load' + Resources] = function(params) {
			return function(dispatch) {
				dispatch(loadingResources());
				return app.service('/api/' + resources).find(params, function(err, objects) {
					dispatch(loadedResources(err ? new Error(err.message) : objects));
				});
			};
		};

		actions['load' + Resource] = function(id, params) {
			return function(dispatch) {
				dispatch(loadingResource({ id: id }));
				return app.service('/api/' + resources).get(id, params, function(err, object) {
					dispatch(loadedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
				});
			};
		};

		actions['create' + Resource] = function(data, params) {
			return function(dispatch) {
				dispatch(creatingResource());
				return app.service('/api/' + resources).create(data, params, function(err, object) {
					dispatch(createdResource(err ? new Error(err.message) : object));
				});
			};
		};

		actions['update' + Resource] = function(id, data, params) {
			return function(dispatch) {
				dispatch(updatingResource({ id: id }));
				return app.service('/api/' + resources).update(id, data, params, function(err, object) {
					dispatch(updatedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
				});
			};
		};

		actions['patch' + Resource] = function(id, data, params) {
			return function(dispatch) {
				dispatch(patchingResource({ id: id }));
				return app.service('/api/' + resources).patch(id, data, params, function(err, object) {
					dispatch(patchedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
				});
			};
		};

		actions['remove' + Resource] = function(id, params) {
			return function(dispatch) {
				dispatch(removingResource({ id: id }));
				return app.service('/api/' + resources).remove(id, params, function(err, object) {
					dispatch(removedResource(err ? _.extend(new Error(err.message), { id: id }) : object));
				});
			};
		};
	}

	if (!options || !options.dispatch || !options.realtime) {
		return _.noop;
	}

	var dispatchCreatedResource = _.compose(options.dispatch, createdResource);
	var dispatchUpdatedResource = _.compose(options.dispatch, updatedResource);
	var dispatchPatchedResource = _.compose(options.dispatch, patchedResource);
	var dispatchRemovedResource = _.compose(options.dispatch, removedResource);

	app.service('/api/messages').on('created', dispatchCreatedResource);
	app.service('/api/messages').on('updated', dispatchUpdatedResource);
	app.service('/api/messages').on('patched', dispatchPatchedResource);
	app.service('/api/messages').on('removed', dispatchRemovedResource);

	return function() {
		app.service('/api/messages').off('created', dispatchCreatedResource);
		app.service('/api/messages').off('updated', dispatchUpdatedResource);
		app.service('/api/messages').off('patched', dispatchPatchedResource);
		app.service('/api/messages').off('removed', dispatchRemovedResource);
	};
};
