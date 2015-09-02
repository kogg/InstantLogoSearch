var express = require('express');
var swig    = require('swig')

var PORT = process.env.PORT || 5000;

var app = express();

app.use(express.static(__dirname + '/public'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',       __dirname + '/views');
app.set('view cache',  app.get('env') === 'production'); // http://expressjs.com/api.html#app.set
swig.setDefaults({ cache: app.get('env') === 'production' ? 'memory' : false }); // http://paularmstrong.github.io/swig/docs/api/#CacheOptions

app.use(require('./controllers'));

app.listen(PORT, function() {
    console.log('Application Started');
});