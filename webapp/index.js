var Root  = require('./Root');
var Store = require('./store');

module.exports = function(state, app, callback) {
	var store = Store(state);

	var dom = Root(store);

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
