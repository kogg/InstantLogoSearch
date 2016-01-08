var bodyParser = require('body-parser');
var feathers   = require('feathers');
var fs         = require('fs');
var path       = require('path');
var ReactDOM   = require('react-dom/server');

var actions = require('./actions');
var Root    = require('./components/Root');
var Store   = require('./store');

var app = feathers();

app.set('port', process.env.PORT || 5000);

app.use(feathers.static(path.join(__dirname, '/dist'), { maxage: '365d' }));
app.configure(feathers.rest());
app.configure(feathers.socketio());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));
app.locals.cacheBuster = function(assetPath) {
	return assetPath + '?' + fs.statSync(path.join(__dirname, 'dist', assetPath)).mtime.getTime().toString(16);
};

actions.setup(app);

app.use('/api/messages', require('feathers-memory')());
var i = 0;
setInterval(function() {
	app.service('/api/messages').create({ text: 'this is message #' + i, date: Date.now() });
	i++;
}, 1000);

app.get('/', function(req, res) {
	var store = Store();

	res.render('main', {
		markup: ReactDOM.renderToString(Root(store)),
		state:  store.getState()
	});
});

module.exports = app;
