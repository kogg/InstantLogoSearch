require('babel-register');
var _         = require('underscore');
var debug     = require('debug')(process.env.npm_package_name + ':application');
var error     = require('debug')(process.env.npm_package_name + ':application:error');
var feathers  = require('feathers');
var fs        = require('fs');
var logos     = require('instant-logos');
var memoize   = require('memoizee');
var os        = require('os');
var path      = require('path');
var promisify = require('es6-promisify');
var svg2png   = require('svg2png');

var app         = require('./application');
var opensearch  = require('./opensearch');
var Logos       = require('./services/Logos');
var Sources     = require('./services/Sources');
var Suggestions = require('./services/Suggestions');

var convertLogo = memoize(function(file_path, callback) {
	return promisify(fs.readFile)(file_path)
		.then(_.partial(svg2png, _, { height: 512 }))
		.then(
			_.partial(callback, null),
			callback
		);
}, { length: 1, async: true, maxAge: 30 * 60 * 1000, preFetch: true });

_.chain(logos)
	.reject(function(logo) {
		return !logo.svg || !logo.svg.path;
	})
	.indexBy(function(logo) {
		return logo.svg.path.directory + '///' + logo.source.shortname;
	})
	.each(function(logo) {
		app.use('/svg/' + logo.source.shortname, feathers.static(logo.svg.path.directory, { maxage: '365d' }));
	});
app.get('/png', function(req, res, next) {
	if (!req.query.id) {
		return next();
	}

	var logo = _.findWhere(logos, { id: req.query.id });

	if (!logo || !logo.svg || !logo.svg.path) {
		return next();
	}

	convertLogo(path.join(logo.svg.path.directory, logo.svg.path.filename), function(err, png) {
		if (err) {
			return next(err);
		}
		res.set('Cache-Control', 'public, max-age=31536000');
		res.set('Content-Type', 'image/png');
		res.send(png);
	});
});
app.use('/api/logos', Logos);
app.use('/api/sources', Sources);
app.use('/api/suggestions', Suggestions);

app.get('/api/logos.xml', function(req, res, next) {
	if (!req.query.format) {
		req.query.format = 'atom';
	}
	if (!_.contains(['atom', 'rss'], req.query.format)) {
		return next();
	}
	var terms = (req.query.q || '').replace(/[.\-()]/gi, '').split(/\s+/);
	app.service('/api/logos').find({ query: { shortname: { $in: terms } } }).then(
		function(results) {
			res.header('Content-Type', 'application/xml');
			var domain = req.protocol + '://' + (req.get('origin') || req.get('host'));
			res.send(opensearch[req.query.format](
				domain,
				terms,
				_.chain(results)
					.uniq(false, 'shortname')
					.map(function(logo) {
						return _.defaults({ url: domain + '/' + logo.shortname }, logo);
					})
					.sortBy(function(logo) {
						return -logo.downloads;
					})
					.value()
			));
		},
		next
	);
});

app.get('/api/logo_suggestions', function(req, res, next) {
	if (!req.query.q) {
		return res.send(['', [], [], []]);
	}
	var q = req.query.q.replace(/[.\-()]/gi, '');
	app.service('/api/logos').find().then(
		function(results) {
			results = _.chain(results)
				.filter(function(logo) {
					return logo.shortname.indexOf(q) === 0;
				})
				.groupBy('shortname')
				.sortBy(function(logos) {
					return -_.reduce(logos, function(memo, logo) {
						return memo + logo.downloads;
					}, 0);
				})
				.map(function(logos) {
					return _.first(logos);
				})
				.value();
			var domain = req.protocol + '://' + (req.get('origin') || req.get('host'));
			res.json([
				req.query.q,
				_.pluck(results, 'shortname'),
				_.pluck(results, 'name'),
				_.map(results, function(logo) {
					return domain + '/' + logo.shortname;
				})
			]);
		},
		next
	);
});

app.all('*', function(req, res) {
	res.status(404).send('Not Found');
});

app.use(function(err, req, res, next) {
	error('error on url ' + req.url, err.stack);
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).send(err.message);
});

app.listen(app.get('port'), function() {
	debug('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
