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
                                  normalized_name: brand.name.toLowerCase().replace(/[^a-z0-9]+/g, ''),
                                  logos:           [{ name:  'Default',
                                                      files: [{ name: '200x300', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: '300x400', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: '400x500', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: 'SVG',     url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' }] },
                                                    { name:  'White on Blue',
                                                      files: [{ name: '200x300', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: '300x400', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: '400x500', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: 'SVG',     url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' }] },
                                                    { name:  'Variation 3',
                                                      files: [{ name: '200x300', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: '300x400', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: '400x500', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
                                                              { name: 'SVG',     url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' }] },
                                                    { name:  'Variation 4',
                                                      files: [{ name: '200x300', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: '300x400', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: '400x500', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
                                                              { name: 'SVG',     url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' }] }] });
          })
          .sortBy('normalized_name')
          .value();

exports.all = function(callback) {
    callback(null, brands);
};
