var _           = require('underscore');
var createStore = require('redux').createStore;
var Provider    = require('react-redux').Provider;
var React       = require('react');

var App = require('./components/App');
var DevTools;
if (process.env.NODE_ENV !== 'production') {
	DevTools = require('./components/DevTools');
}

module.exports = function(state, app, callback) {
	var store = (DevTools ? DevTools.instrument()(createStore) : createStore)(function(state, action) {
		switch (_.result(action, 'type')) {
			case 'LOADED_MESSAGES':
				return _.defaults({ messages: _.result(action, 'payload') }, state);
			case 'CREATED_MESSAGE':
				return _.defaults({ messages: _.union(state.messages || [], [_.result(action, 'payload')]) }, state);
			default:
				return state || { messages: [] };
		}
	}, state);

	var dom = DevTools ? (
		<Provider store={store}>
			<div>
				<App />
				<DevTools />
			</div>
		</Provider>
	) : (
		<Provider store={store}>
			<App />
		</Provider>
	);

	// TODO There needs to be some kind of mapper between feathers and reducers
	var messages = app.service('api/messages');

	messages.on('created', function(message) {
		store.dispatch({
			type:    'CREATED_MESSAGE',
			payload: message
		});
	});

	var initial_loaded;
	store.dispatch({ type: 'LOADING_MESSAGES' });
	messages.find(function(err, messages) {
		initial_loaded = true;
		store.dispatch({
			type:    'LOADED_MESSAGES',
			payload: err || messages,
			error:   Boolean(err)
		});
	});

	if (callback) {
		var unsubscribe = store.subscribe(function() {
			if (!initial_loaded) {
				return;
			}
			unsubscribe();
			callback(null, dom, store.getState());
		});
	}

	return dom;
};
