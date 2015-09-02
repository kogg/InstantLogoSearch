var _ = require('underscore');

var brands = [{ name: 'About.me' },
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
              brand.effective_name = brand.name.toLowerCase().replace(/[^a-z]+/g, '');
          })
          .sortBy('effective_name')
          .value();

exports.all = function(callback) {
    callback(null, brands);
};
