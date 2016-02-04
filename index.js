require('babel-register');
var debug  = require('debug')(process.env.npm_package_name + ':application');
var error  = require('debug')(process.env.npm_package_name + ':application:error');
var http   = require('http');
var memory = require('feathers-memory');
var os     = require('os');

var app = require('./application');

app.use('/api/messages', memory());

app.all('*', function(req, res, next) {
	var err = new Error(http.STATUS_CODES[404] + ' - ' + req.url);
	err.status = 404;
	next(err);
});

app.use(function(err, req, res, next) {
	error('error on url ' + req.url, err);
	if (res.headersSent) {
		return next(err);
	}
	res.status(err.status || 500);
	res.json({ message: err.message });
});

app.listen(app.get('port'), function() {
	debug('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
