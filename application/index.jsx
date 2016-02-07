var _              = require('underscore');
var bodyParser     = require('body-parser');
var compression    = require('compression');
var feathers       = require('feathers');
var helmet         = require('helmet');
var match          = require('react-router').match;
var memoize        = require('memoizee');
var path           = require('path');
var promisify      = require('es6-promisify');
var serverRender   = require('feathers-react-redux/serverRender');
var sm             = require('sitemap');
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

var getSitemapXML = _.once(function() {
	var sitemap = sm.createSitemap({
		hostname:  process.env.npm_package_homepage,
		cacheTime: 60000,
		urls:      [{ url: '/', priority: 1 }]
	});

	return promisify(sitemap.toXML.bind(sitemap))();
});
app.get('/sitemap.xml', function(req, res, next) {
	getSitemapXML().then(
		function(xml) {
			res.header('Content-Type', 'application/xml');
			res.send(xml);
		},
		next
	);
});

app.set('page-render', memoize(function(url, redirect) {
	return promisify(match)({ routes: routes, location: url })
		.then(function(response) { // Correlates with redirectLocation, renderProps
			if (response[0]) {
				redirect(302, response[0].pathname + response[0].search);
				return Promise.resolve();
			}
			if (!response[1]) {
				return Promise.reject();
			}

			var store = Store();
			return serverRender(<Provider store={store}><RoutingContext {...response[1]} /></Provider>, store, actions)
				.then(function(locals) {
					return promisify(app.render).bind(app)('index', _.extend(locals, { state: store.getState() }));
				})
				.then(function(html) {
					return { html: html, date: (new Date()).toUTCString() };
				});
		});
}, { length: 1 })); // TODO Won't this cache actions performed in serverRender forever?

app.get(/^(?!\/(?:(?:api|svg)\/|png)).*$/, function(req, res, next) {
	app.get('page-render')(req.url, res.redirect.bind(res)).then(
		function(render) {
			if (!render) {
				return;
			}
			res.set('Cache-Control', 'public, max-age=' + (24 * 60 * 60));
			res.set('Last-Modified', render.date);
			res.send(render.html);
		},
		next
	);
});

module.exports = app;
