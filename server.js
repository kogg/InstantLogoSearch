var path     = require('path');
var ReactDOM = require('react-dom/server');

var express_app = require('./express-app');
var app         = require('./app');

express_app.set('port', process.env.PORT || 5000);

express_app.set('view engine', 'jade');
express_app.set('views', path.join(__dirname, '/views'));

express_app.get('/', function(req, res) {
	var state = { message: 'some message' };
	res.render('main', {
		markup: ReactDOM.renderToString(app(state)),
		state:  state
	});
});

express_app.listen(express_app.get('port'));
