var _ = require('underscore');

var colors = ['#044a75', '#1f3136', '#9bb7c8', '#cddbe3'];

var brands = [{ name: '4ormat' },
              { name: '4teen' },
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
              brand.colors = colors;
              brand.normalized_name = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
          })
          .sortBy('normalized_name')
          .value();

exports.all = function(callback) {
    callback(null, brands);
};
