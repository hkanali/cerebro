var async = require('async');
var fs = require('fs');
var yaml = require('js-yaml');

var tinder = require('./modules/tinder');
var fb = require('./modules/facebook');
var imageUtil = require('./modules/imageUtil');

var config = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8'));

var fb_id = config.facebook.user_id;
var fb_token = config.facebook.user_access_token;

var name = '山田 太郎';

var fbImageDir = './image/facebook/';
var tinderImageDir = './image/tinder/';

var main = {
    run: function() {
        var page = 0;
        async.waterfall([
            // login!
            function(callback) {
                fb.login(fb_token);
                callback(null);
            },

            // search!
            function(callback) {
                fb.searchUsersByName(name, page, function(err, res) {
                    if (err) console.log(err);
                    page++;
                    callback(null, res.data);
                });
            },

            // get prof image!!
            function(users, callback) {
                var usersInfo = [];
                async.each(users, function(user, next) {
                    fb.getUserProfilePicUri(user['id'], function(err, res) {
                        // 画像がデフォルトの場合は詰めない
                        if (!res['picture']['data']['is_silhouette']) {
                            usersInfo.push(res);
                        }
                        next();
                    });
                }, function complete(err) {
                    if (err) console.error(err);
                    callback(null, usersInfo);
                });
            },

            // save image
            function(usersInfo, callback) {
                async.each(usersInfo, function(userInfo, next) {
                    imageUtil.saveImage(userInfo['picture']['data']['url'], fbImageDir + userInfo['id'] + '.jpg').on('finish', function() {
                        next();
                    });
                }, function complete(err) {
                    if (err) console.error(err);
                    callback(null, usersInfo);
                });
            },

            // convert image
            function(usersInfo, callback) {
                async.each(usersInfo, function(userInfo, next) {
                    imageUtil.convertImage(fbImageDir + userInfo['id'] + '.jpg', fbImageDir + userInfo['id'] + '.png', function(err) {
                        if (err) console.error(err);
                        next();
                    });
                }, function complete(err) {
                    if (err) console.error(err);
                    callback(null, usersInfo);
                });
            },

            // compare images
            function(usersInfo, callback) {
                async.each(usersInfo, function(userInfo, next) {
//                    imageUtil.compareImages(tinderImageDir + tinderUserId + '.png', fbImageDir + userInfo['id'] + '.png', function(data) {
                    imageUtil.compareImages(fbImageDir + userInfo['id'] + '.png', fbImageDir + userInfo['id'] + '.png', function(data) {
                        console.log(data);
                        next();
                    });
                }, function complete(err) {
                    if (err) console.error(err);
                    console.log('fin');
                });
            }
        ])
    }
}

module.exports = main;
