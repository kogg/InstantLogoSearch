require('babel-register');
var os = require('os');

var app   = require('./application');
var Logos = require('./services/Logos');

app.use('/api/logos', Logos);

app.listen(app.get('port'), function() {
	console.log('Server is running at', 'http://' + os.hostname() + ':' + app.get('port'));
});
