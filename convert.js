var fs        = require('fs');
var promisify = require('es6-promisify');
var redis     = require('redis');
var svg2png   = require('svg2png');

var redis_client = redis.createClient({ url: process.env.REDISCLOUD_URL, return_buffers: true });

module.exports = function(file_path) {
	return promisify(redis_client.get.bind(redis_client))(file_path)
		.catch(function() {
			return Promise.resolve();
		})
		.then(function(data) {
			return data || promisify(fs.readFile)(file_path)
				.then(function(data) {
					return svg2png(data, { height: 512 }).catch(function(err) {
						if (err.message !== 'Width or height could not be determined from either the source file or the supplied dimensions') {
							throw err;
						}
						return svg2png(data, { height: 512, width: 1024 });
					});
				})
				.then(function(data) {
					redis_client.setex(file_path, 60 * 60, data);
					return data;
				});
		});
};
