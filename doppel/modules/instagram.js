var Nightmare = require('nightmare');
var request = require('request');

var instagramConnection = require('./instagramConnection');

var instagram = {
    getInstaUrls : function(urls) {
        var instagramUrls = [];
        for (var i = 0; i < urls.length; i++) {
            if (urls[i].expanded_url.match(/instagram.com/)) {
                instagramUrls.push(urls[i].expanded_url);
            }
        }
        return instagramUrls;
    },

    getInstaPhotoUrl : function(url, callback) {
        console.log('[Instagram] open url: ' + url);
        new Nightmare()
            .goto(url)
            .wait(5000)
            .evaluate(function() {
                return document.querySelector('#react-root > div > div > div > div > div > div > div > div > div > div.iMedia.LikeableFrame > div').getAttribute('src');
            },
            function(photoUrl) {
                callback(photoUrl);
            })
            .run(function (err, nightmare) {
                if (err) console.error(err);
            });
    },

    getRealTimeStream : function (req, clientId, accessToken) {
        var self = this;
        var stream = req.body[0];
        var objectPlural = stream['object'] + 's';
        if (stream.object == 'geography') {
            objectPlural = 'geographies';
        }
        var url = 'https://api.instagram.com/v1/' + objectPlural + '/' + encodeURIComponent(stream['object_id']) + '/media/recent?client_id=' + clientId; // + '&count=1'; // TODO geographiesの時のレスポンスが変な気がする
        console.log('[Instagram] access!: ' + url);
        request(url, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                var data = JSON.parse(body).data[0];
                console.log('[Instagram] user: ' + data['user']['username'] + ', link: ' + data['link']);
                // TODO きゃー、herokuからsakuraちゃんをみれるのかしら〜？？
                self.insertUserInfo(data['user'], accessToken);
            } else {
                console.error(body);
                console.error(error);
                console.error(response.statusCode);
            }
        });
    },

    insertUserInfo : function (user, accessToken) {
        var url = 'https://api.instagram.com/v1/users/' + user['id'] + '?access_token=' + accessToken;
        request(url, function (error, response, body) {
            var userInfo = JSON.parse(body).data;
            instagramConnection.select(userInfo.id, function(res) {
                if (!res) {
                    instagramConnection.insert(userInfo, function (res) {
                        console.log('[Instagram] inserted userInfo: ' + userInfo.id);
                    });
                } else {
                    instagramConnection.update(userInfo, function (res) {
                        console.log('[Instagram] updated userInfo: ' + userInfo.id);
                    });
                }
            });
        });
    },

    registerTagSubscript : function(clientId, clientSecret, instaCallbackUrl, tagName, callback) {
        var formData = {
            client_id: clientId,
            client_secret: clientSecret,
            object: 'tag',
            aspect: 'media',
            object_id: tagName,
            callback_url: instaCallbackUrl
        };
        request.post({url: 'https://api.instagram.com/v1/subscriptions/', form: formData}, callback);
    },

    registerGeoSubscript : function() {
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
        */
    }
};

module.exports = instagram;
