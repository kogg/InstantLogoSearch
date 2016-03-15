var fs        = require('fs');
var memoize   = require('memoizee');
var promisify = require('es6-promisify');
var svg2png   = require('svg2png');

module.exports = function(file_path) {
	return promisify(fs.readFile)(file_path).then(function(data) {
		return svg2png(data, { height: 512 }).catch(function() {
			return svg2png(data, { height: 512, width: 1024 });
		});
	});
};

if (!process.env.DONT_CACHE_PNGS) {
	module.exports = memoize(module.exports, { maxAge: 10 * 60 * 1000, preFetch: true });
}
