var _ = require('underscore');

var brands = [{ name: '4ormat' },
              { name: '4teen' },
              { name: '500px' },
              { name: 'About.me', colors: ['#044a75', '#1f3136', '#9bb7c8', '#cddbe3'] },
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
              _.defaults(brand, { colors:          _.times(4, function() { return '#' + _.sample('0123456789abcdef', 6).join(''); }),
                                  normalized_name: brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '') });
          })
          .sortBy('normalized_name')
          .value();

exports.all = function(callback) {
    callback(null, brands);
};
