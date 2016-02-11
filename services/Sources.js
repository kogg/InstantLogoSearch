var _     = require('underscore');
var logos = require('instant-logos');

var sources = _.chain(logos)
	.pluck('source')
	.uniq(false, function(source) {
		return source.shortname;
	})
	.each(function(source) {
		source.id = source.shortname;
	})
	.value();

module.exports = {
	find: function() {
		return Promise.resolve(sources);
	}
};
