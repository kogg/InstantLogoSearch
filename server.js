var app = require('./app');

app.set('port', process.env.PORT || 5000);

app.use('/', require('./routes'));

app.listen(app.get('port'));
