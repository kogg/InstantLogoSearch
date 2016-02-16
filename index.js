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
var search      = require('./search');
var Logos       = require('./services/Logos');
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
app.use('/api/suggestions', Suggestions);

app.get('/api/logos.xml', function(req, res, next) {
	if (!req.query.format) {
		req.query.format = 'atom';
	}
	if (!_.contains(['atom', 'rss'], req.query.format)) {
		return next();
	}
	app.service('/api/logos').find().then(
		function(results) {
			var terms = search.terms(req.query.q);
			res.header('Content-Type', 'application/xml');
			var domain = req.protocol + '://' + (req.get('origin') || req.get('host'));
			res.send(opensearch[req.query.format](
				domain,
				terms,
				_.chain(search(results, terms))
					.uniq(false, 'shortname')
					.map(function(logo) {
						return _.defaults({ url: domain + '/' + logo.shortname }, logo);
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
	app.service('/api/logos').find().then(
		function(results) {
			results = _.uniq(search(results, req.query.q), false, 'shortname');
			var names  = _.pluck(results, 'name');
			res.json([
				req.query.q,
				names,
				names,
				_.map(results, function(logo) {
					return req.protocol + '://' + (req.get('origin') || req.get('host')) + '/' + logo.shortname;
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
