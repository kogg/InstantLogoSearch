var _              = require('underscore');
var bodyParser     = require('body-parser');
var compression    = require('compression');
var feathers       = require('feathers');
var helmet         = require('helmet');
var match          = require('react-router').match;
var path           = require('path');
var promisify      = require('es6-promisify');
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

app.get(/(?!\/api\/.*)/, function(req, res, next) {
	promisify(match)({ routes: routes, location: req.url })
		.then(function(response) { // Correlates with redirectLocation, renderProps
			if (response[0]) {
				return res.redirect(302, response[0].pathname + response[0].search);
			}
			if (!response[1]) {
				return next();
			}

			var store = Store();
			return serverRender(<Provider store={store}><RoutingContext {...response[1]} /></Provider>, store, actions).then(function(locals) {
				res.render('index', _.extend(locals, { state: store.getState() }));
			});
		})
		.catch(function(err) {
			next(err);
		});
});

module.exports = app;
