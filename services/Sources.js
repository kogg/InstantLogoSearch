var _     = require('underscore');
var logos = require('instant-logos');

var logos_count_by_source = _.countBy(logos, function(logo) {
	return logo.source.shortname;
});

var sources = _.chain(logos)
	.pluck('source')
	.uniq(false, function(source) {
		return source.shortname;
	})
	.each(function(source) {
		source.id = source.shortname;
		source.count = logos_count_by_source[source.shortname];
	})
	.value();

module.exports = {
	find: function() {
		return Promise.resolve(sources);
	}
};
