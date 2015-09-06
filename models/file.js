var _ = require('underscore');

var files = [
    { brand_normalized_name: 'shayan',      logo_name: 'Default',       name: 'SVG',    url: 'https://s3-us-west-2.amazonaws.com/instantlogosearch.com/Shayan-Default-SVG.svg' },
    { brand_normalized_name: 'shayan',      logo_name: 'Variation',     name: 'SVG',    url: 'https://s3-us-west-2.amazonaws.com/instantlogosearch.com/Shayan-Variation-SVG.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Default',       name: 'Small',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Default',       name: 'Medium', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Default',       name: 'Large',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'White on Blue', name: 'Small',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'White on Blue', name: 'Medium', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'White on Blue', name: 'Large',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'White on Blue', name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 3',   name: 'Small',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 3',   name: 'Medium', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 3',   name: 'Large',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 3',   name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/white_on_blue.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 4',   name: 'Small',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 4',   name: 'Medium', url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 4',   name: 'Large',  url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '4ormat',      logo_name: 'Variation 4',   name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: '500px',       logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'aboutme',     logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'addvocate',   logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'adobe',       logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'aetna',       logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'aim'  ,       logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'baidu',       logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'bandcamp',    logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'barnesnoble', logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'bebo',        logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
    { brand_normalized_name: 'behance',     logo_name: 'Default',       name: 'SVG',    url: 'https://d2ed0w4q03gsmw.cloudfront.net/s3/assets/baf2144/images/assets/blue_on_white.svg' },
];

files = _.each(files, function(file, id) {
    file.id = id;
});

exports.all = function(callback) {
    callback(null, files);
};
