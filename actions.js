var _                = require('underscore');
var createAction     = require('redux-actions').createAction;
var resourcesActions = require('feathers-react-redux').resourcesActions;

var getApplication = function() {
	return require('./application');
};

module.exports = _.extend(
	{
		loadLocalStorage:     createAction('LOAD_LOCAL_STORAGE'),
		clearCollection:      createAction('CLEAR_COLLECTION'),
		addToCollection:      createAction('ADD_TO_COLLECTION'),
		removeFromCollection: createAction('REMOVE_FROM_COLLECTION'),
		downloaded:           createAction('DOWNLOADED'),
		resetDownloaded:      createAction('RESET_DOWNLOADED'),
		considerLogo:         createAction('CONSIDER_LOGO'),
		unconsiderLogo:       createAction('UNCONSIDER_LOGO'),
		search:               createAction('SEARCH')
	},
	resourcesActions(getApplication, 'logo'),
	resourcesActions(getApplication, 'suggestion')
);
