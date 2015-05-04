var express = require('express');
var router = express.Router();

var request = require('request');
var config = require('config');

var instagramService = require('../modules/instagram');

var instagramConf = config.get('instagram');

router.get('/', function(req, res, next) {
    var tagName = req.query['tagName'];
    if (tagName != '' && tagName != undefined) {
        instagramService.registerTagSubscript(instagramConf['clientId'],
            instagramConf['clientSecret'],
            'https://cerebro1989.herokuapp.com/instagram/callback',
            tagName, function(err, httpResponse, body) {
                if (err) {
                    console.error(err);
                } else {
                    console.log(body);
                }
            });
    }

    instagramService.countUsers(function(result) {
        res.render('instagram/index', { title: 'Instagram REAL-TIME API on Cerebro', userCount: result[0].count });
    });

});

router.get('/callback', function(req, res, next) {
    res.render('instagram/callback', { challenge: req.query['hub.challenge'] });
});

router.post('/callback', function(req, res, next) {
    instagramService.getRealTimeStream(req, instagramConf['clientId'], instagramConf['accessToken']);
    res.render('instagram/index', { title: 'Cerebro' });
});

module.exports = router;
