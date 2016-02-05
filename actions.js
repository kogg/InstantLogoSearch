var _                = require('underscore');
var createAction     = require('redux-actions').createAction;
var resourcesActions = require('feathers-react-redux').resourcesActions;

module.exports = _.extend(
	{
		loadCollection:       createAction('LOAD_COLLECTION'),
		clearCollection:      createAction('CLEAR_COLLECTION'),
		addToCollection:      createAction('ADD_TO_COLLECTION'),
		removeFromCollection: createAction('REMOVE_FROM_COLLECTION'),
		considerLogo:         createAction('CONSIDER_LOGO'),
		unconsiderLogo:       createAction('UNCONSIDER_LOGO'),
		search:               createAction('SEARCH')
	},
	resourcesActions(function() {
		return require('./application');
	}, 'logo')
);
