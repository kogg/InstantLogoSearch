var createStore = require('redux').createStore;
var App         = require('./components/App');
var Provider    = require('react-redux').Provider;
var React       = require('react');

module.exports = function(state) {
	var store = createStore(function(state) {
		return state || {};
	}, state);

	return (
		<Provider store={store}>
			<App />
		</Provider>
	);
};
