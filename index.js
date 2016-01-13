require('babel-register');

var app = require('./application');

app.listen(app.get('port'));
