var bodyParser   = require('body-parser');
var compression  = require('compression');
var error        = require('debug')(process.env.npm_package_name + ':application:error');
var feathers     = require('feathers');
var fs           = require('fs');
var helmet       = require('helmet');
var http         = require('http');
var path         = require('path');
var serverRender = require('feathers-react-redux/serverRender');

var actions = require('../actions');
var Root    = require('../components/Root');
var Store   = require('../store');

var app = feathers();

app.set('port', process.env.PORT || 5000);

app.use(helmet());
app.use(compression());
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

	serverRender(root, store, actions)
		.catch(next)
		.then(function(markup) {
			res.render('main', {
				markup: markup,
				state:  store.getState()
			});
		});
});

app.all('*', function(req, res, next) {
	next(new Error(http.STATUS_CODES[404]));
});

app.use(function(err, req, res, next) {
	error(err);
	next(err);
});

module.exports = app;
