var _         = require('underscore');
var google    = require('googleapis');
var logos     = require('instant-logos');
var memoize   = require('memoizee');
var path      = require('path');
var promisify = require('es6-promisify');

logos = _.map(logos, function(logo) {
	if (!logo.svg || !logo.svg.path) {
		return _.pick(logo, 'id', 'name');
	}
	return _.chain(logo)
		.pick('id', 'name')
		.defaults({
			searchable: logo.name.toLowerCase().replace(/[.\- ]/gi, ''),
			svg:        '/' + path.join('svg', logo.source.shortname, logo.svg.path.filename),
			png:        '/png?id=' + logo.id
		})
		.value();
});

var analytics = google.analytics({
	version: 'v3',
	auth:    new google.auth.JWT(
		process.env.GOOGLE_ANALYTICS_EMAIL,
		null,
		process.env.GOOGLE_ANALYTICS_PRIVATE_KEY,
		['https://www.googleapis.com/auth/analytics.readonly']
	)
});

var getUniquePurchases = memoize(function() {
	return promisify(analytics.data.ga.get)({
		'ids':        'ga:' + process.env.GOOGLE_ANALYTICS_VIEW_ID,
		'start-date': '31daysAgo',
		'end-date':   'today',
		'metrics':    'ga:uniquePurchases',
		'dimensions': 'ga:productSku'
	}).then(function(results) {
		return _.chain(results)
			.first()
			.result('rows')
			.object()
			.mapObject(Number)
			.value();
	});
}, { maxAge: 60 * 60 * 1000, preFetch: true });

module.exports = {
	find: function() {
		return getUniquePurchases().then(
			function(uniquePurchases) {
				return _.map(logos, function(logo) {
					return _.defaults({ downloads: uniquePurchases[logo.id] || 0 }, logo);
				});
			},
			function(err) {
				console.log(err);
				return logos;
			}
		);
	}
};
