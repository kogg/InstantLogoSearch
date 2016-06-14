var _             = require('underscore');
var bodyParser    = require('body-parser');
var compression   = require('compression');
var feathers      = require('feathers');
var helmet        = require('helmet');
var match         = require('react-router').match;
var path          = require('path');
var promisify     = require('es6-promisify');
var rest          = require('feathers-rest');
var serverRender  = require('feathers-react-redux/serverRender');
var sm            = require('sitemap');
var Provider      = require('react-redux').Provider;
var React         = require('react');
var RouterContext = require('react-router').RouterContext;

var actions    = require('../actions');
var opensearch = require('../opensearch');
var routes     = require('../components/routes');
var Store      = require('../store');

var app = feathers();

app.set('port', process.env.PORT || 5000);

app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(feathers.static(path.join(__dirname, '../assets'), { maxage: '365d' }));
app.use(feathers.static(path.join(__dirname, '../dist'), { maxage: '365d' }));
app.configure(rest());

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, '../components'));
app.engine('jsx', require('express-react-views').createEngine({ transformViews: false }));

var getSitemapXML = _.once(function() {
	return app.service('/api/logos').find().then(function(logos) {
		var sitemap = sm.createSitemap({
			hostname:  process.env.npm_package_homepage,
			cacheTime: 60000,
			urls:      _.chain(logos)
				.uniq(false, 'shortname')
				.map(function(logo) {
					return { url: '/' + logo.shortname };
				})
				.unshift({ url: '/', changefreq: 'daily', priority: 1 })
				.value()
		});

		return promisify(sitemap.toXML.bind(sitemap))();
	});
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

app.get('/opensearchdescription.xml', function(req, res) {
	res.header('Content-Type', 'application/xml');
	res.send(opensearch.description(req.protocol + '://' + (req.get('origin') || req.get('host'))));
});

app.get(/^(?!\/(?:(?:api|svg)\/|png|zip))[^.]*$/, function(req, res, next) {
	var i = Math.random();
	if (process.env.TIME_PAGE) {
		console.time('time_' + i);
	}
	return promisify(match, { multiArgs: true })({ routes: routes, location: req.url })
		.then(function(response) { // Correlates with redirectLocation, renderProps
			if (response[0]) {
				return res.redirect(302, response[0].pathname + response[0].search);
			}
			if (!response[1]) {
				var err = new Error();
				err.status = 404;
				return next(err);
			}

			var store = Store();
			return serverRender(<Provider store={store}><RouterContext {...response[1]} /></Provider>, store, actions)
				.then(function(locals) {
					return promisify(app.render.bind(app))('index', _.extend(locals, {
						state:  store.getState(),
						domain: req.protocol + '://' + (req.get('origin') || req.get('host'))
					}));
				})
				.then(function(html) {
					if (process.env.TIME_PAGE) {
						console.timeEnd('time_' + i);
					}
					if (!html) {
						var err = new Error();
						err.status = 404;
						return next(err);
					}
					res.set('Cache-Control', 'public, max-age=' + (24 * 60 * 60));
					res.set('Last-Modified', (new Date()).toUTCString());
					res.send(html);
				});
		})
		.catch(next);
});

module.exports = app;
