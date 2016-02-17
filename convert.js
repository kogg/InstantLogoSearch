var _         = require('underscore');
var fs        = require('fs');
var memoize   = require('memoizee');
var promisify = require('es6-promisify');
var svg2png   = require('svg2png');

module.exports = memoize(function(file_path) {
	return promisify(fs.readFile)(file_path).then(_.partial(svg2png, _, { height: 512 }));
}, { maxAge: 30 * 60 * 1000, preFetch: true });
