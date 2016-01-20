var _          = require('underscore');
var async      = require('async');
var bodyParser = require('body-parser');
var feathers   = require('feathers');
var fs         = require('fs');
var path       = require('path');
var ReactDOM   = require('react-dom/server');

var actions = require('../actions');
var Root    = require('../components/Root');
var Store   = require('../store');

var app = feathers();

app.set('port', process.env.PORT || 5000);

app.use(feathers.static(path.join(__dirname, '../dist'), { maxage: '365d' }));
app.configure(feathers.rest());
app.configure(feathers.socketio());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '../views'));
app.locals.cacheBuster = function(assetPath) {
	return assetPath + '?' + fs.statSync(path.join(__dirname, '../dist', assetPath)).mtime.getTime().toString(16);
};

app.get('/', function(req, res, next) {
	var store = Store();

	var root = Root(store);

	var markup;
	var done_server_actions = [];
	async.until(
		function() {
			markup = ReactDOM.renderToString(root);
			return _.chain(store)
				.result('getState')
				.result('server_actions')
				.difference(done_server_actions)
				.isEmpty()
				.value();
		},
		function(callback) {
			var todo_actions = _.chain(store)
				.result('getState')
				.result('server_actions')
				.without(done_server_actions)
				.value();
			async.each(
				todo_actions,
				function(action, callback) {
					store.dispatch(actions[action.type](actions.params)).then(
						function() {
							callback();
						},
						callback
					);
				},
				function(err) {
					done_server_actions = _.union(done_server_actions, todo_actions);
					callback(err);
				}
			);
		},
		function(err) {
			if (err) {
				return next(err);
			}
			res.render('main', {
				markup: markup,
				state:  store.getState()
			});
		}
	);
});

module.exports = app;
