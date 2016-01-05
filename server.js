var path     = require('path');
var ReactDOM = require('react-dom/server');

var express_app = require('./express-app');
var app         = require('./app');

express_app.set('port', process.env.PORT || 5000);

express_app.set('view engine', 'jade');
express_app.set('views', path.join(__dirname, '/views'));

express_app.use('/api/messages', require('feathers-memory')());

var i = 0;
setInterval(function() {
	express_app.service('api/messages').create({ text: 'this is message #' + i });
	i++;
}, 1000);

express_app.get('/', function(req, res, next) {
	express_app.service('api/messages').find(function(err, messages) {
		if (err) {
			return next(err);
		}

		var state = { messages: messages };
		res.render('main', {
			markup: ReactDOM.renderToString(app(state)),
			state:  state
		});
	});
});

express_app.listen(express_app.get('port'));
