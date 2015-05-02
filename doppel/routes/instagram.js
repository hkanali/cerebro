var express = require('express');
var router = express.Router();

var request = require('request');
var config = require('config');

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
            console.log(err);
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
            console.log(err);
        } else {
            console.log(body);
        }
    });
    */

    res.render('instagram/index', { title: 'Instagram REAL-TIME API on Cerebro' });
});

router.get('/callback', function(req, res, next) {
    var challenge = req.query['hub.challenge'];
    res.render('instagram/callback', { challenge: challenge });
});

router.post('/callback', function(req, res, next) {
    var stream = req.body[0];
    switch (stream.object) {
        case 'tag' :
            var url = 'https://api.instagram.com/v1/tags/' + encodeURIComponent(stream.object_id) + '/media/recent?client_id=' + instagramConf['clientId'] + '&count=1';
            console.log('ACCESS!: ' + url);
            request(url, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    console.log(JSON.parse(body).data[0]);
                } else {
                    console.log(body);
                    console.log(error);
                    console.log(response.statusCode);
                }
            });
            break;
        case 'geography' :
            break;
    }
    res.render('instagram/index', { title: 'Cerebro' });
});

module.exports = router;
