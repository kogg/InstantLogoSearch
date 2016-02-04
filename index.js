require('babel-register');
var _        = require('underscore');
var debug    = require('debug')(process.env.npm_package_name + ':application');
var error    = require('debug')(process.env.npm_package_name + ':application:error');
var feathers = require('feathers');
var fs       = require('fs');
var http     = require('http');
var logos    = require('instant-logos');
var memoize  = require('memoizee');
var os       = require('os');
var path     = require('path');
var q        = require('q');
var svg2png  = require('svg2png');

var app   = require('./application');
var Logos = require('./services/Logos');

var readFile  = q.denodeify(fs.readFile);

var convertLogo = memoize(function(file_path, callback) {
	return readFile(file_path)
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
app.use('/api/logos', Logos);
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

app.all('*', function(req, res, next) {
	var err = new Error(http.STATUS_CODES[404] + ' - ' + req.url);
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	error('error on url ' + req.url, err);
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.status || 500);
	res.json(err);
});

app.listen(app.get('port'), function() {
	debug('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
