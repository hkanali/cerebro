var express = require('express');
var router = express.Router();

var request = require('request');
var config = require('config');

var instagramService = require('../modules/instagram');

var instagramConf = config.get('instagram');

router.get('/', function(req, res, next) {
    /*
    var formData = {
        client_id: instagramConf['clientId'],
        client_secret: instagramConf['clientSecret'],
        object: 'geography',
        aspect: 'media',
        lat: '35.658517', // @Shibuya Station
        lng: '139.701334',
        radius: '20000',
        verify_token: 'cerebro1989',
        callback_url: 'https://cerebro1989.herokuapp.com/instagram/callback'
    };
    request.post({url: 'https://api.instagram.com/v1/subscriptions/', form: formData}, function(err, httpResponse, body) {
        if (err) {
            console.error(err);
        } else {
            console.log(body);
        }
    });

    var formData = {
        client_id: instagramConf['clientId'],
        client_secret: instagramConf['clientSecret'],
        object: 'tag',
        aspect: 'media',
        object_id: '渋谷',
        callback_url: 'https://cerebro1989.herokuapp.com/instagram/callback'
    };
    request.post({url: 'https://api.instagram.com/v1/subscriptions/', form: formData}, function(err, httpResponse, body) {
        if (err) {
            console.error(err);
        } else {
            console.log(body);
        }
    });
    */

    res.render('instagram/index', { title: 'Instagram REAL-TIME API on Cerebro' });
});

router.get('/callback', function(req, res, next) {
    res.render('instagram/callback', { challenge: req.query['hub.challenge'] });
});

router.post('/callback', function(req, res, next) {
    instagramService.getRealTimeStream(req, instagramConf['clientId']);
    res.render('instagram/index', { title: 'Cerebro' });
});

module.exports = router;
