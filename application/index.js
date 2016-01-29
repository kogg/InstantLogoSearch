var bodyParser   = require('body-parser');
var compression  = require('compression');
var error        = require('debug')(process.env.npm_package_name + ':application:error');
var feathers     = require('feathers');
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(feathers.static(path.join(__dirname, '../dist'), { maxage: '365d' }));
app.configure(feathers.rest());
app.configure(feathers.socketio());

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, '../components'));
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

app.get('/', function(req, res, next) {
	var store = Store();

	var root = Root(store);

	serverRender(root, store, actions)
		.catch(next)
		.then(function(markup) {
			res.render('index', {
				markup: markup,
				state:  store.getState()
			});
		});
});

app.all('*', function(req, res, next) {
	var err = new Error(http.STATUS_CODES[404]);
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	error('error on url ' + req.url, err);
	next(err);
});

module.exports = app;
