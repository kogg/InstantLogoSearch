var _         = require('underscore');
var pluralize = require('pluralize');

var actions         = require('../actions');
var app             = require('../application');
var feathersActions = require('../feathers-actions');

module.exports = {
	componentDidMount: function() {
		this.feathers_subscriptions = [];
	},
	subscribeToService: function(resource) {
		var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
		var resources = pluralize(resource);

		feathersActions(resource);

		var dispatches = _.chain(['created', 'updated', 'patched', 'removed'])
			.indexBy(_.identity)
			.mapObject(function(action) {
				return _.compose(this.props.dispatch, actions[action + Resource]);
			}.bind(this))
			.value();

		_.each(dispatches, function(dispatch, action) {
			app.service('/api/' + resources).on(action, dispatch);
		});

		this.feathers_subscriptions.push(function() {
			_.each(dispatches, function(dispatch, action) {
				app.service('/api/' + resources).off(action, dispatch);
			});
		});
	},
	componentWillUnmount: function() {
		this.feathers_subscriptions.forEach(_.partial);
	}
};
