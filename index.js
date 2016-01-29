require('babel-register');
var debug = require('debug')(process.env.npm_package_name + ':application');
var os    = require('os');

var app   = require('./application');
var Logos = require('./services/Logos');

app.use('/api/logos', Logos);

app.listen(app.get('port'), function() {
	debug('Server running', 'http://' + os.hostname() + ':' + app.get('port'));
});
