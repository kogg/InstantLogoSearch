var _     = require('underscore');
var logos = require('instant-logos');

var sorted_logos = _.sortBy(logos, function(logo) {
	return logo.name.charAt(0).toLowerCase();
});

module.exports = {
	find: _.constant(Promise.resolve(sorted_logos))
};
