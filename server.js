require('babel-register');
var ReactDOM = require('react-dom/server');

var app   = require('./app');
var Root  = require('./components/Root');
var Store = require('./store');

// TODO Have legitimate endpoints
app.use('/api/messages', require('feathers-memory')());
var i = 0;
setInterval(function() {
	app.service('api/messages').create({ text: 'this is message #' + i });
	i++;
}, 1000);

app.get('/', function(req, res) {
	var store = Store();

	res.render('main', {
		markup: ReactDOM.renderToString(Root(store)),
		state:  store.getState()
	});
});

app.listen(app.get('port'));
