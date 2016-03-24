var rollbar = require('rollbar');

var rollbarConfig = {
	codeVersion: process.env.npm_package_gitHead,
	environment: process.env.ROLLBAR_ENV || process.env.NODE_ENV,
	enabled:     process.env.NODE_ENV && process.env.ROLLBAR_ACCESS_TOKEN
};
rollbar.init(process.env.ROLLBAR_ACCESS_TOKEN || ' ', rollbarConfig);

rollbar.config = rollbarConfig;

module.exports = rollbar;
