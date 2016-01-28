var _     = require('underscore');
var logos = require('instant-logos');

module.exports = {
	find: function() {
		return new Promise(function(resolve) {
			var sorted_logos = _.sortBy(logos, 'name');
			resolve(sorted_logos);
		});
	}
};
