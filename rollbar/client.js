var Rollbar = require('rollbar');

module.exports = Rollbar.init({
	accessToken:     process.env.ROLLBAR_CLIENT_ACCESS_TOKEN,
	captureUncaught: true,
	payload:         {
		environment: process.env.ROLLBAR_ENV || process.env.NODE_ENV
	},
	enabled: process.env.NODE_ENV && process.env.ROLLBAR_CLIENT_ACCESS_TOKEN,
	verbose: !process.env.NODE_ENV
});
