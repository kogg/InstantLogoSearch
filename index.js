require('babel-register');
var debug  = require('debug')(process.env.npm_package_name + ':application');
var error  = require('debug')(process.env.npm_package_name + ':application:error');
var memory = require('feathers-memory');
var os     = require('os');

var app = require('./application');

app.use('/api/messages', memory());

app.all('*', function(req, res) {
	res.status(404).send('Not Found');
});

app.use(function(err, req, res, next) {
	error('error on url ' + req.url, err.stack);
	if (res.headersSent) {
		return next(err);
	}
	res.status(500).send(err.message);
});

app.listen(app.get('port'), function() {
	debug('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
