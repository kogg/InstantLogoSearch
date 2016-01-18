var _         = require('underscore');
var pluralize = require('pluralize');

var actions         = require('../actions');
var feathersActions = require('../feathers-actions');

var default_options = { client_load: false };

module.exports = {
	feathers: function(resource, options) {
		feathersActions(resource);

		_.extend(this, _.mapObject(default_options, function(value, name) {
			return _.result(options, name, value) ? _.union(this[name], [resource]) : this[name];
		}.bind(this)));
	},
	componentWillMount: function() {
	},
	componentDidMount: function() {
		_.each(this.client_load, function(resource) {
			var resources = pluralize(resource);
			var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

			this.props.dispatch(actions['load' + Resources]());
		}.bind(this));
	},
	componentWillUnmount: function() {
	}
};
