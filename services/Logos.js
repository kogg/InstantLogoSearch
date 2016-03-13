var _         = require('underscore');
var google    = require('googleapis');
var logos     = require('instant-logos');
var path      = require('path');
var promisify = require('es6-promisify');

logos = _.chain(logos)
	.map(function(logo) {
		if (!logo.svg || !logo.svg.path) {
			return _.pick(logo, 'id', 'name');
		}
		return _.chain(logo)
			.pick('id', 'name', 'shortname', 'source')
			.defaults({
				svg: '/' + path.join('svg', logo.source.shortname, logo.svg.path.filename),
				png: '/png?id=' + logo.id
			})
			.value();
	})
	.sortBy('name')
	.value();

var analytics = google.analytics({
	version: 'v3',
	auth:    new google.auth.JWT(
		process.env.GOOGLE_ANALYTICS_EMAIL,
		null,
		process.env.GOOGLE_ANALYTICS_PRIVATE_KEY,
		['https://www.googleapis.com/auth/analytics.readonly']
	)
});

function getUniquePurchases() {
	return promisify(analytics.data.ga.get)({
		'ids':        'ga:' + process.env.GOOGLE_ANALYTICS_VIEW_ID,
		'start-date': '4daysAgo',
		'end-date':   'today',
		'metrics':    'ga:uniquePurchases',
		'dimensions': 'ga:productSku'
	}).then(
		function(results) {
			return _.chain(results)
				.first()
				.result('rows')
				.object()
				.mapObject(Number)
				.value();
		},
		function(err) {
			console.log(err); // TODO #20
			throw err;
		}
	);
}
var uniquePurchases = getUniquePurchases();
setInterval(function() {
	var newUniquePurchases = getUniquePurchases();
	uniquePurchases = newUniquePurchases;
}, 60 * 60 * 1000);

module.exports = {
	find: function() {
		return uniquePurchases.then(
			function(uniquePurchases) {
				return _.chain(logos)
					.map(function(logo) {
						return _.defaults({ downloads: uniquePurchases[logo.id] || 0 }, logo);
					})
					.sortBy(function(logo) {
						return -logo.downloads;
					})
					.value();
			},
			_.constant(logos)
		);
	}
};
