var _          = require('underscore');
var bodyParser = require('body-parser');
var feathers   = require('feathers');
var fs         = require('fs');
var path       = require('path');
var ReactDOM   = require('react-dom/server');

var Root  = require('../components/Root');
var Store = require('../store');

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
	app.service('/api/messages').find(function(err, messages) {
		if (err) {
			return next(err);
		}
		var store = Store({
			messages: _.chain(messages)
				.indexBy('id')
				.mapObject(function(message) {
					return { data: message };
				})
				.value()
		});

		res.render('main', {
			markup: ReactDOM.renderToString(Root(store)),
			state:  store.getState()
		});
	});
});

module.exports = app;
