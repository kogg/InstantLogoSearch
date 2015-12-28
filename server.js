var express_app = require('./express-app');

express_app.set('port', process.env.PORT || 5000);

express_app.use('/', require('./routes'));

express_app.listen(express_app.get('port'));
