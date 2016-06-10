var _         = require('underscore');
var promisify = require('es6-promisify');
var request   = promisify(require('request'), { multiArgs: true });

function requestPromise(options) {
	return request(options).then(function(results) {
		if (results[0].statusCode >= 300) {
			throw new Error(results[0].statusCode + ': ' + (_.result(results[1], 'error_description') || _.result(results[0], 'statusMessage')));
		}
		return results;
	});
}

module.exports = {
	create: function(data) {
		var err;

		if (!_.result(data, 'name')) {
			err = new Error('\'name\' not specified');
			err.status = 400;
			return Promise.reject(err);
		}
		if (!_.result(data, 'file')) {
			err = new Error('\'file\' not specified');
			err.status = 400;
			return Promise.reject(err);
		}
		return requestPromise({
			url:     'https://content.dropboxapi.com/2/files/upload',
			method:  'POST',
			body:    data.file,
			headers: {
				'Authorization':   'Bearer ' + process.env.DROPBOX_ACCESS_TOKEN,
				'Content-Type':    'application/octet-stream',
				'Dropbox-API-Arg': JSON.stringify({
					path:       '/instantlogosearch/' + data.name.replace(/\//g, '-') + '.svg',
					mode:       'add',
					autorename: true,
					mute:       true
				})
			}
		}).then(function(response) {
			return _.pick(JSON.parse(response[1]), 'id');
		});
	}
};
