var feathers = require('feathers');
var path     = require('path');

var app = require('./app');

app.set('view engine', 'jade');
app.set('views', path.join(__dirname, '/views'));

var router   = feathers.Router();
var App      = require('./components/App');
var React    = require('react');
var ReactDOM = require('react-dom/server');

router.get('/', function(req, res) {
	var state = { message: 'some message' };

	res.render('main', {
		markup: ReactDOM.renderToString(
			<App message={state.message} />
		),
		state: state
	});
});

module.exports = router;
