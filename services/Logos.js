var memory = require('feathers-memory');

var service = memory();

service.create({ name: 'facebook' });
service.create({ name: 'adobe' });
service.create({ name: 'adobe photoshop' });
service.create({ name: 'adobe illustrator' });
service.create({ name: 'netflix' });
service.create({ name: 'zillow' });
service.create({ name: 'redfin' });

module.exports = service;
