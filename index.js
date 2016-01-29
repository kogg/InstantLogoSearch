require('babel-register');
var debug  = require('debug')(process.env.npm_package_name + ':application');
var memory = require('feathers-memory');
var os     = require('os');

var app = require('./application');

app.use('/api/messages', memory());

app.listen(app.get('port'), function() {
	debug('Server running at', 'http://' + os.hostname() + ':' + app.get('port'));
});
