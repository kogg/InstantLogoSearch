var _     = require('underscore');
var logos = require('instant-logos');

module.exports = {
	find: function(params, callback) {
		return new Promise(function(resolve) {
			var sorted_logos = _.sortBy(logos, 'name');
			callback(null, sorted_logos);
			resolve(sorted_logos);
		});
	}
};
