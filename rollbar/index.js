var path    = require('path');
var rollbar = require('rollbar');

var rollbarConfig = {
	codeVersion: process.env.npm_package_gitHead,
	enabled:     process.env.NODE_ENV && process.env.ROLLBAR_ACCESS_TOKEN,
	environment: process.env.ROLLBAR_ENV || process.env.NODE_ENV,
	verbose:     !process.env.NODE_ENV || !process.env.ROLLBAR_ACCESS_TOKEN,
	root:        path.join(__dirname, '..')
};
rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN || ' ', rollbarConfig);

rollbar.config = rollbarConfig;

if (!process.env.NODE_ENV) {
	rollbar.handleError = console.log;
}

module.exports = rollbar;
