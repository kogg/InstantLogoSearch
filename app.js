var feathers   = require('feathers');
var bodyParser = require('body-parser');

var app = feathers();

app.configure(feathers.rest());
app.configure(feathers.socketio());
app.use(bodyParser.json());

module.exports = app;
