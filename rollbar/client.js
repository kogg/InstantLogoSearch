var Rollbar = require('rollbar-browser');

module.exports = Rollbar.init({
	payload: {
		client: {
			javascript: {
				code_version:          process.env.npm_package_gitHead,
				source_map_enabled:    true,
				guess_uncaught_frames: true
			}
		},
		environment: process.env.HEROKU_APP_NAME || process.env.ROLLBAR_ENV || process.env.NODE_ENV
	},
	accessToken:     process.env.ROLLBAR_CLIENT_ACCESS_TOKEN,
	captureUncaught: true,
	enabled:         process.env.ROLLBAR_CLIENT_ACCESS_TOKEN,
	verbose:         !process.env.ROLLBAR_CLIENT_ACCESS_TOKEN
});
