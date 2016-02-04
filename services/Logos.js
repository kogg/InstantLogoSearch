var _     = require('underscore');
var logos = require('instant-logos');
var path  = require('path');

module.exports = {
	find: function() {
		return Promise.resolve(this.logos);
	},
	setup: function() {
		this.logos = _.chain(logos)
			.map(function(logo) {
				if (!logo.svg || !logo.svg.path) {
					return logo;
				}
				return _.chain(logo)
					.pick('id', 'name')
					.defaults({
						svg:       '/' + path.join('svg', logo.source.shortname, logo.svg.path.filename),
						png:       '/png?id=' + logo.id,
						downloads: Math.round(1000 * Math.random())
					})
					.value();
			})
			.sortBy(function(logo) {
				return logo.name.toLowerCase();
			})
			.value();
	}
};
