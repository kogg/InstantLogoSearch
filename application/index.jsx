var _              = require('underscore');
var bodyParser     = require('body-parser');
var compression    = require('compression');
var feathers       = require('feathers');
var helmet         = require('helmet');
var match          = require('react-router').match;
var path           = require('path');
var serverRender   = require('feathers-react-redux/serverRender');
var Provider       = require('react-redux').Provider;
var React          = require('react');
var RoutingContext = require('react-router').RoutingContext;

var actions = require('../actions');
var routes  = require('../components/routes');
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

app.get('*', function(req, res, next) {
	match({ routes: routes, location: req.url }, function(err, redirectLocation, renderProps) {
		if (err) {
			res.status(500).send(err.message);
		} else if (redirectLocation) {
			res.redirect(302, redirectLocation.pathname + redirectLocation.search);
		} else if (renderProps) {
			var store = Store();

			serverRender(<Provider store={store}><RoutingContext {...renderProps} /></Provider>, store, actions)
				.catch(next)
				.then(function(locals) {
					res.render('index', _.extend(locals, { state: store.getState() }));
				});
		} else {
			next();
		}
	});
});

module.exports = app;
