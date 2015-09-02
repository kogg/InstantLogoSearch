var _ = require('underscore');

exports.all = function(callback) {
    callback(null, _.sortBy([{ name: 'About.me' },
                             { name: 'Addvocate' },
                             { name: 'Adobe' },
                             { name: 'Aetna' },
                             { name: 'Aim' },
                             { name: 'Baidu' },
                             { name: 'Bandcamp' },
                             { name: 'Barnes & Noble' },
                             { name: 'Bebo' },
                             { name: 'Behance' }], 'name'));
};
