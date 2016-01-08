require('babel-register');
var ReactDOM = require('react-dom/server');

var app    = require('./app');
var WebApp = require('./webapp');

// TODO Have legitimate endpoints
app.use('/api/messages', require('feathers-memory')());
var i = 0;
setInterval(function() {
	app.service('api/messages').create({ text: 'this is message #' + i });
	i++;
}, 1000);

app.get('/', function(req, res, next) {
	WebApp(null, app, function(err, dom, state) {
		if (err) {
			return next(err);
		}
		res.render('main', {
			markup: ReactDOM.renderToString(dom),
			state:  state
		});
	});
});

app.listen(app.get('port'));
