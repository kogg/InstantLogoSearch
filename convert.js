var _         = require('underscore');
var fs        = require('fs');
var memoize   = require('memoizee');
var promisify = require('es6-promisify');
var svg2png   = require('svg2png');

if (process.env.CACHE_LOG) {
	var memProfile = require('memoizee/profile');
	setInterval(_.compose(console.log, memProfile.log), process.env.CACHE_LOG);
}

module.exports = memoize(function(file_path) {
	return promisify(fs.readFile)(file_path).then(function(data) {
		return svg2png(data, { height: 512 }).catch(function() {
			return svg2png(data, { height: 512, width: 1024 });
		});
	});
}, { maxAge: 10 * 60 * 1000, preFetch: true });
