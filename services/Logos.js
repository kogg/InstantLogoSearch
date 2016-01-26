var _     = require('underscore');
var logos = require('instant-logos');

function promisify(func) {
	return function() {
		var args     = _.toArray(arguments);
		if (!_.chain(args).last().isFunction().value()) {
			args.push(_.noop);
		}
		return new Promise(function(resolve, reject) {
			args[args.length - 1] = _.wrap(args[args.length - 1], function(callback, err, result) {
				callback(err, result);
				if (err) {
					reject(err);
				} else {
					resolve(result);
				}
			});
			func.apply(this, args);
		});
	};
}

module.exports = {
	find: promisify(function(params, callback) {
		callback(null, _.sortBy(logos, 'name'));
	})
};
