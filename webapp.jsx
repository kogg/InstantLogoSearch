var _           = require('underscore');
var createStore = require('redux').createStore;
var App         = require('./components/App');
var Provider    = require('react-redux').Provider;
var React       = require('react');

module.exports = function(state, app) {
	var store = createStore(function(state, action) {
		switch (_.result(action, 'type')) {
			case 'CREATED_MESSAGE':
				return _.defaults({ messages: _.union(state.messages || [], [_.result(action, 'payload')]) }, state);
			default:
				return state || { messages: [] };
		}
	}, state);

	if (app) {
		app.service('api/messages').on('created', function(message) {
			store.dispatch({
				type:    'CREATED_MESSAGE',
				payload: message
			});
		});
	}

	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
