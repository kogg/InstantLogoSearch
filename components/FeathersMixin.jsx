var _         = require('underscore');
var pluralize = require('pluralize');

var actions         = require('../actions');
var app             = require('../application');
var feathersActions = require('../feathers-actions');

var DEFAULT_OPTIONS = { client_load: false, realtime: false };

module.exports = {
	feathers: function(resource, options) {
		feathersActions(resource);

		_.chain(options || {})
			.defaults(DEFAULT_OPTIONS)
			.each(function(value, name) {
				if (!value) {
					return;
				}
				this[name] = _.union(this[name], [resource]);
			}.bind(this));
	},
	// There's pretty much no reason for anything to be in componentWillMount, since feathers() can only be called AFTER it. Anything that would be there should be in feathers().
	componentDidMount: function() {
		_.each(this.client_load, function(resource) {
			var resources = pluralize(resource);
			var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

			this.props.dispatch(actions['load' + Resources]());
		}.bind(this));

		_.each(this.realtime, function(resource) {
			var Resource  = resource.charAt(0).toUpperCase() + resource.slice(1);
			var resources = pluralize(resource);

			this.cleanups = _.chain(['created', 'updated', 'patched', 'removed'])
				.indexBy(_.identity)
				.mapObject(function(action) {
					return _.compose(this.props.dispatch, actions[action + Resource]);
				}.bind(this))
				.each(function(dispatchAction, action) {
					app.service('/api/' + resources).on(action, dispatchAction);
				})
				.map(function(dispatchAction, action) {
					return function() {
						app.service('/api/' + resources).off(action, dispatchAction);
					};
				})
				.union(this.cleanups)
				.value();
		}.bind(this));
	},
	componentWillUnmount: function() {
		_.each(this.cleanups, _.partial);
	}
};
