var express = require('express');
var Brand   = require('../models/brand');

var router = express.Router();

router.get('/', function (req, res, next) {
    Brand.all(function(err, brands) {
        if (err) {
            return next(err);
        }
        res.render('index', { brands: brands });
    });
});

module.exports = router;
