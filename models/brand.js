var _    = require('underscore');
var File = require('./file');

var brands = [{ name: '4ormat' },
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
              { name: 'Behance' },
              { name: 'Shayan' }];

exports.all = function(callback) {
    File.all(function(err, files) {
        if (err) {
            return callback(err);
        }
        callback(null, _.chain(brands)
                        .map(function(brand) {
                            var normalized_name = brand.name.toLowerCase().replace(/[^a-z0-9]+/g, '');
                            return _.chain(brand)
                                    .clone()
                                    .defaults({ colors:          _.times(4, function() { return '#' + _.sample('0123456789abcdef', 6).join(''); }),
                                                normalized_name: normalized_name,
                                                logos:           _.chain(files)
                                                                  .where({ brand_normalized_name: normalized_name })
                                                                  .groupBy('logo_name')
                                                                  .map(function(logo_files, logo_name) {
                                                                      return { name:  logo_name,
                                                                               files: _.map(logo_files, _.partial(_.omit, _, 'brand_normalized_name', 'logo_name')) };
                                                                  })
                                                                  .value() })
                                    .value();
                        })
                        .sortBy('normalized_name')
                        .value());
    });
};
