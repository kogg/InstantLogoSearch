var _ = require('underscore');

var feathersActions = require('../feathers-actions');

module.exports = {
	componentWillMount: function() {
		this.feathers_subscriptions = [];
	},
	subscribeToService: function(resource, options) {
		this.feathers_subscriptions.push(feathersActions(resource, _.defaults({ dispatch: this.props.dispatch }, options)));
	},
	componentWillUnmount: function() {
		this.feathers_subscriptions.forEach(_.partial);
	}
};
