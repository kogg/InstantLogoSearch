var _        = require('underscore');
var URI      = require('URIjs/src/URI');
var archiver = require('archiver');
var async    = require('async');
var express  = require('express');
var request  = require('request');

var Brand    = require('../models/brand');
var File     = require('../models/file');

var router = express.Router();

router.get('/', function(req, res, next) {
    Brand.all(function(err, brands) {
        if (err) {
            return next(err);
        }
        res.render('index', { brands_by_letter: _.groupBy(brands, function(brand) {
            return _.first(brand.normalized_name).replace(/[0-9]/, '0-9');
        }) });
    });
});

router.get('/collection', function(req, res, next) {
    if (!req.query || !req.query.ids || !req.query.ids.length) {
        return next();
    }
    File.all(function(err, files) {
        if (err) {
            return next();
        }
        res.writeHead(200, { 'Content-Type':        'application/zip',
                             'Content-disposition': 'attachment; filename=collection.zip' });
        files = _.chain(req.query.ids)
                 .filter(function(id) {
                     return id >= 0 && id < files.length;
                 })
                 .map(function(id) {
                     return files[id];
                 })
                 .value();
        if (files.length !== req.query.ids.length) {
            return next();
        }
        var archive = archiver('zip');
        archive.on('error', next);
        archive.pipe(res);
        _.each(files, function(file) {
            archive.append(request(file.url), { name: URI(file.url).filename() });
        });
        archive.finalize();
    });
});

router.get('/[A-Za-z0-9]+', function(req, res, next) {
    Brand.all(function(err, brands) {
        if (err) {
            return next(err);
        }
        var brand = _.findWhere(brands, { normalized_name: req.path.toLowerCase().substring(1) });
        if (!brand) {
            return next();
        }
        res.render('index', { brand: brand, brands_by_letter: _.groupBy(brands, function(brand) {
            return _.first(brand.normalized_name).replace(/[0-9]/, '0-9');
        }) });
    });
});

module.exports = router;
