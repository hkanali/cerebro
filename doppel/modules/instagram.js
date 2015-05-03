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
                // self.insertUserInfo(data['user'], accessToken);
            } else {
                console.error(body);
                console.error(error);
                console.error(response.statusCode);
            }
        });
    },

    insertUserInfo : function (user) {
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
    } 
};

module.exports = instagram;
