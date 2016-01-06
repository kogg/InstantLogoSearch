var ReactDOM = require('react-dom/server');

var app    = require('./app');
var webapp = require('./webapp');

// TODO Have legitimate endpoints
app.use('/api/messages', require('feathers-memory')());
var i = 0;
setInterval(function() {
	app.service('api/messages').create({ text: 'this is message #' + i });
	i++;
}, 1000);

app.get('/', function(req, res, next) {
	app.service('api/messages').find(function(err, messages) {
		if (err) {
			return next(err);
		}

		var state = { messages: messages };
		res.render('main', {
			markup: ReactDOM.renderToString(webapp(state)),
			state:  state
		});
	});
});

app.listen(app.get('port'));
