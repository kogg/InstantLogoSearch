require('babel-register');
var memory = require('feathers-memory');
var os     = require('os');

var app = require('./application');

app.use('/api/logos', memory());
app.service('/api/logos').create({ name: 'facebook' });
app.service('/api/logos').create({ name: 'adobe' });
app.service('/api/logos').create({ name: 'adobe photoshop' });
app.service('/api/logos').create({ name: 'adobe illustrator' });
app.service('/api/logos').create({ name: 'netflix' });
app.service('/api/logos').create({ name: 'zillow' });
app.service('/api/logos').create({ name: 'redfin' });

app.listen(app.get('port'), function() {
	console.log('Server is running at', 'http://' + os.hostname() + ':' + app.get('port'));
});
