var _         = require('underscore');
var pluralize = require('pluralize');

var actions         = require('../actions');
var feathersActions = require('../feathers-actions');

var default_options = { client_load: false, realtime: false };

module.exports = {
	feathers: function(resource, options) {
		feathersActions(resource);

		_.chain(options || {})
			.defaults(default_options)
			.each(function(value, name) {
				if (!value) {
					return;
				}
				this[name] = _.union(this[name], [resource]);
			}.bind(this));
	},
	componentWillMount: function() {
		// There's pretty much no reason for anything to be here, since feathers() can only be called AFTER this. Anything that would be here should go in there.
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
