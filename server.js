var express = require('express');
var swig    = require('swig')

var PORT = process.env.PORT || 5000;

var app = express();

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',       __dirname + '/views');
app.set('view cache',  app.get('env') === 'production');
swig.setDefaults({ cache: app.get('env') === 'production' ? 'memory' : false });

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(PORT, function() {
    console.log('Application Started');
});
