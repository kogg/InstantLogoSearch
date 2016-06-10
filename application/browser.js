var feathers = require('feathers-client');
var rest     = require('feathers-rest/client');

var app = feathers(document.location.origin);
global.fetch = null;
require('whatwg-fetch');
app.configure(rest().fetch(global.fetch));

module.exports = app;
