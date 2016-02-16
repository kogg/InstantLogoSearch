var _           = require('underscore');
var levenshtein = require('fast-levenshtein');

var searchFunc = function(logos, filters) {
	if (_.isString(filters)) {
		filters = searchFunc.terms(filters);
	}
	if (_.isEmpty(filters)) {
		return _.sortBy(logos, function(logo) {
			return -logo.downloads;
		});
	}
	filters = _.sortBy(filters, function(filter) {
		return -filter.length; // The longer the word, the more likely it won't match anything
	});
	return _.chain(logos)
		.reject(function(logo) {
			return _.some(filters, function(filter) {
				return logo.shortname.indexOf(filter) === -1;
			});
		})
		.sortBy(function(logo) {
			return _.chain(filters)
				.map(_.partial(levenshtein.get, logo.shortname))
				.max()
				.value();
		})
		.value();
};

searchFunc.terms = function(filterstring) {
	return _.compact((filterstring || '').trim().toLowerCase().replace(/[.\-()]/gi, '').split(/\s+/));
};

module.exports = searchFunc;
