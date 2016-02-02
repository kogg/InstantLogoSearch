var _            = require('underscore');
var bodyParser   = require('body-parser');
var compression  = require('compression');
var feathers     = require('feathers');
var helmet       = require('helmet');
var memoize      = require('memoizee');
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
if (process.env.npm_package_feathersjs_socket) {
	app.configure(feathers.socketio());
}

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, '../components'));
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

app.set('page-render', memoize(function(url, callback) {
	var store = Store();
	var root = Root(store);

	serverRender(root, store, actions)
		.catch(callback)
		.then(function(locals) {
			app.render('index', _.extend(locals, { state: store.getState() }), function(err, html) {
				callback(err, { html: html, date: (new Date()).toUTCString() });
			});
		});
}, { async: true, length: 1 }));

app.get('/', function(req, res, next) {
	app.get('page-render')(req.url, function(err, render) {
		if (err) {
			return next(err);
		}
		res.set('Cache-Control', 'public, max-age=' + (24 * 60 * 60));
		res.set('Last-Modified', render.date);
		res.send(render.html);
	});
});

module.exports = app;
