var bodyParser = require('body-parser');
var feathers   = require('feathers');
var path       = require('path');

var app = feathers();

app.use(feathers.static(path.join(__dirname, '/dist')));
app.configure(feathers.rest());
app.configure(feathers.socketio());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

module.exports = app;
