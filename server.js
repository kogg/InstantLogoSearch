var path = require('path');

var express_app = require('./express-app');

express_app.set('port', process.env.PORT || 5000);

express_app.set('view engine', 'jade');
express_app.set('views', path.join(__dirname, '/views'));

var App      = require('./components/App');
var React    = require('react');
var ReactDOM = require('react-dom/server');

express_app.get('/', function(req, res) {
	var state = { message: 'some message' };

	res.render('main', {
		markup: ReactDOM.renderToString(
			<App message={state.message} />
		),
		state: state
	});
});

express_app.listen(express_app.get('port'));
