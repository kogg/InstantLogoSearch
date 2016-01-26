require('babel-register');
var memory = require('feathers-memory');
var os     = require('os');

var app = require('./application');

app.use('/api/messages', memory());

app.listen(app.get('port'), function() {
	console.log('Server is running at', 'http://' + os.hostname() + ':' + app.get('port'));
});
