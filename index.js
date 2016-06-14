require('babel-register');
var _         = require('underscore');
var feathers  = require('feathers');
var fs        = require('fs');
var http      = require('http');
var logos     = require('instant-logos');
var os        = require('os');
var path      = require('path');
var promisify = require('es6-promisify');
var JSZip     = require('jszip');

if (process.env.PERIODIC_GC) {
	setInterval(function() {
		console.log(process.memoryUsage());
		console.log('run gc');
		console.log(process.memoryUsage());
		global.gc();
	}, 60 * 1000);
}

var app         = require('./application');
var convert     = require('./convert');
var opensearch  = require('./opensearch');
var rollbar     = require('./rollbar');
var search      = require('./search');
var Logos       = require('./services/Logos');
var Suggestions = require('./services/Suggestions');

var rollbarErrorHandler = (process.env.NODE_ENV && process.env.ROLLBAR_ACCESS_TOKEN) ?
	rollbar.errorHandler(process.env.ROLLBAR_ACCESS_TOKEN || ' ', rollbar.config) :
	function(err, req, res, next) {
		console.error(err);
		console.error(err.stack);
		next(err);
	};

_.chain(logos)
	.reject(function(logo) {
		return !logo.svg || !logo.svg.path;
	})
	.indexBy(function(logo) {
		return logo.svg.path.directory + '///' + logo.source.shortname;
	})
	.each(function(logo) {
		app.use('/svg/' + logo.source.shortname, feathers.static(logo.svg.path.directory, {
			maxage:     '365d',
			setHeaders: function(res, filepath) {
				res.setHeader('Content-Disposition', 'attachment; filename="' + path.basename(filepath) + '"');
			}
		}));
	});
app.get('/png', function(req, res, next) {
	if (!req.query.id) {
		return next();
	}

	var logo = _.findWhere(logos, { id: req.query.id });

	if (!logo || !logo.svg || !logo.svg.path) {
		return next();
	}

	convert(path.join(logo.svg.path.directory, logo.svg.path.filename)).then(
		function(data) {
			if (!data) {
				return next();
			}
			res.set('Cache-Control', 'public, max-age=31536000');
			res.set('Content-Type', 'image/png');
			res.set('Content-Disposition', 'attachment; filename="' + logo.id + '.png"');
			res.send(data);
		},
		next
	);
});
app.get('/zip', function(req, res, next) {
	if (req.query.randomlogos === 'loaderio-ac72b9b54887459b638947a317ceacce') {
		req.query.filetype = _.sample(['svg', 'png']);
		req.query.ids = _.chain(logos)
			.sample(1 + Math.floor(3 * Math.random()))
			.pluck('id')
			.value();
	}
	if (!_.contains(['svg', 'png'], req.query.filetype) || !req.query.ids) {
		return next();
	}

	var zippable_logos = _.filter(logos, function(logo) {
		return logo.svg && logo.svg.path && _.contains(req.query.ids, logo.id);
	});

	if (req.query.ids.length !== zippable_logos.length) {
		return next();
	}

	zippable_logos = _.chain(zippable_logos).compact().uniq().value();

	var zip = new JSZip();
	Promise.all(_.map(zippable_logos, function(logo) {
		var file_path = path.join(logo.svg.path.directory, logo.svg.path.filename);
		return (req.query.filetype === 'svg' ? promisify(fs.readFile)(file_path) : convert(file_path)).then(function(data) {
			var h = 0;
			var name;
			do {
				h++;
				name = logo.name + (h === 1 ? '' : ' (' + h + ')') + '.' + req.query.filetype;
			} while (zip.file(name));
			zip.file(name, data);
		});
	}))
		.then(function() {
			return zip.generateAsync({ type: 'nodebuffer' });
		})
		.then(function(zipContent) {
			res.set('Cache-Control', 'public, max-age=31536000');
			res.set('Content-Type', 'application/zip');
			res.set('Content-Disposition', 'attachment; filename=logos.zip');
			res.send(zipContent);
		})
		.catch(next);
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

app.all('*', function(req, res, next) {
	var err = new Error();
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	var status = err.status || err.code || 500;
	if (status >= 400 && status < 500) {
		return next(err);
	}
	rollbarErrorHandler(err, req, res, next);
});

app.use(function(err, req, res, next) {
	if (res.headersSent) {
		return next(err);
	}
	var status = err.status || err.code || 500;
	res.status(status).send(err.message || http.STATUS_CODES[status]);
});

app.listen(app.get('port'), function() {
	console.log('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
