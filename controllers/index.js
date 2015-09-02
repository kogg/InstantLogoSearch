var _       = require('underscore');
var express = require('express');
var Brand   = require('../models/brand');

var router = express.Router();

router.get('/', function (req, res, next) {
    Brand.all(function(err, brands) {
        if (err) {
            return next(err);
        }
        res.render('index', { grouped_brands: _.groupBy(brands, function(brand) {
            return brand.name[0].toLowerCase();
        }) });
    });
});

module.exports = router;
