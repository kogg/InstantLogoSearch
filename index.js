require('babel-register');

var app = require('./app');

app.listen(app.get('port'));
