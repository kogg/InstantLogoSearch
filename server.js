var express = require('express');
var swig    = require('swig');

var PORT = process.env.PORT || 5000;

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules'));
app.use(express.static(__dirname + '/generated'));

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views',       __dirname + '/views');
app.set('view cache',  app.get('env') === 'production'); // http://expressjs.com/api.html#app.set
swig.setDefaults({ cache: app.get('env') === 'production' ? 'memory' : false }); // http://paularmstrong.github.io/swig/docs/api/#CacheOptions
swig.setFilter('trie', function(string) {
    var classes = '';
    var current_class = 'trie-';
    var length = string.length;
    for (var i = 0; i < length; i++) {
        current_class += string[i];
        classes += current_class + ' ';
    }
    return classes;
});

app.use(require('./controllers'));

app.listen(PORT, function() {
    console.log('Application Started');
});
