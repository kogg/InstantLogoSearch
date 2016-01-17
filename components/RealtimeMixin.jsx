var _         = require('underscore');
var pluralize = require('pluralize');

var actions         = require('../actions');
var app             = require('../application');
var feathersActions = require('../feathers-actions');

module.exports = {
	componentWillMount: function() {
		this.feathers_subscriptions = [];
	},
	subscribeToService: function(resource, options) {
		var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
		var resources = pluralize(resource);

		feathersActions(resource, _.defaults({ dispatch: this.props.dispatch }, options));

		var dispatchCreatedResource = _.compose(this.props.dispatch, actions['created' + Resource]);
		var dispatchUpdatedResource = _.compose(this.props.dispatch, actions['updated' + Resource]);
		var dispatchPatchedResource = _.compose(this.props.dispatch, actions['patched' + Resource]);
		var dispatchRemovedResource = _.compose(this.props.dispatch, actions['removed' + Resource]);

		app.service('/api/' + resources).on('created', dispatchCreatedResource);
		app.service('/api/' + resources).on('updated', dispatchUpdatedResource);
		app.service('/api/' + resources).on('patched', dispatchPatchedResource);
		app.service('/api/' + resources).on('removed', dispatchRemovedResource);

		this.feathers_subscriptions.push(function() {
			app.service('/api/' + resources).off('created', dispatchCreatedResource);
			app.service('/api/' + resources).off('updated', dispatchUpdatedResource);
			app.service('/api/' + resources).off('patched', dispatchPatchedResource);
			app.service('/api/' + resources).off('removed', dispatchRemovedResource);
		});
	},
	componentWillUnmount: function() {
		this.feathers_subscriptions.forEach(_.partial);
	}
};
