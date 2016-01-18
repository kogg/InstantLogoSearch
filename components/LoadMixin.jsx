var pluralize = require('pluralize');

var actions         = require('../actions');
var feathersActions = require('../feathers-actions');

module.exports = {
	loadFromService: function(resource) {
		var resources = pluralize(resource);
		var Resources = resources.charAt(0).toUpperCase() + resources.slice(1);

		feathersActions(resource);

		this.props.dispatch(actions['load' + Resources]());
	}
};
