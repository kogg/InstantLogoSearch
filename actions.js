var resourcesActions = require('feathers-react-redux').resourcesActions;

module.exports = resourcesActions(function() {
	return require('./application');
}, 'logo');
