var _ = require('underscore');

var brands = [{ name: '4ormat' },
              { name: '500px' },
              { name: 'About.me' },
              { name: 'Addvocate' },
              { name: 'Adobe' },
              { name: 'Aetna' },
              { name: 'Aim' },
              { name: 'Baidu' },
              { name: 'Bandcamp' },
              { name: 'Barnes & Noble' },
              { name: 'Bebo' },
              { name: 'Behance' }];
brands = _.chain(brands)
          .each(function(brand) {
              brand.normalized_name = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
          })
          .sortBy('normalized_name')
          .value();

exports.all = function(callback) {
    callback(null, brands);
};
