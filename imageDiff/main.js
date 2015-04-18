var async = require('async');
var fs = require('fs');
var fse = require('fs-extra');
var yaml = require('js-yaml');

var tinder = require('./modules/tinder');
var fb = require('./modules/facebook');
var imageUtil = require('./modules/imageUtil');

var config = yaml.safeLoad(fs.readFileSync('../config.yml', 'utf8'));

var fb_id = config.facebook.user_id;
var fb_token = config.facebook.user_access_token;

var fbImageDir = './image/facebook/';
var tinderImageDir = './image/tinder/';

var main = {
    run: function () {
        this.getTinderUsers();
    },
    getTinderUsers: function() {
        var me = this;
        async.waterfall([
            function(callback) {
                tinder.authorize(fb_token, fb_id, function() {
                    callback(null);
                });
            },
            function(callback) {
                tinder.getHistory(function(err, res) {
                    callback(null, res['matches']);
                });
            },
            function(tinderUsers, callback) {
                for (var i = 0; i < 10/*tinderUsers.length*/; i++) {
                    var tinderUserId = tinderUsers[i]['person']['_id'];
                    var tinderUserName = tinderUsers[i]['person']['name'];
                    var imageUri = tinderUsers[i]['person']['photos'][0]['url'];
                    me.saveTinderImage(tinderUserId, imageUri);
                    me.searchWithFb(tinderUserId, tinderUserName, 0);
                }
            }
        ]);
    },
    saveTinderImage: function(userId, imageUri) {
        async.waterfall([
            function(callback) {
                imageUtil.saveImage(imageUri, tinderImageDir + userId + '.jpg').on('finish', function() {
                    callback(null);
                });
            },

            // convert image
            function(callback) {
                imageUtil.convertImage200200(tinderImageDir + userId + '.jpg', tinderImageDir + userId + '.png', function(err) {
                    if (err) console.error(err);
                    callback(null);
                });
            }
        ])
    },

    searchWithFb: function(userId, name, page) {
        var me = this;
        if (!page) page = 0;
        async.waterfall([
            // login!
            function(callback) {
                fb.login(fb_token);
                callback(null);
            },

            // search!
            function(callback) {
                fb.searchUsersByName(name, page, function(err, res) {
                    var users = [];
                    if (err) console.log(err);
                    if (!res || res.data.length == 0) {
                        page = -1;
                    } else {
                        users = res.data;
                        page++;
                    }
                    callback(null, users);
                });
            },

            // get prof image!!
            function(users, callback) {
                var usersInfo = [];
                async.each(users, function(user, next) {
                    fb.getUserProfilePicUri(user['id'], function(err, res) {
                        // 画像がデフォルトの場合は詰めない
                        if (res && !res['picture']['data']['is_silhouette']) {
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
                    imageUtil.convertImage200200(fbImageDir + userInfo['id'] + '.jpg', fbImageDir + userInfo['id'] + '.png', function(err) {
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
                    imageUtil.compareImages(tinderImageDir + userId + '.png', fbImageDir + userInfo['id'] + '.png', function(res) {
                        console.log("============================");
                        console.log("SEARCHING in FACEBOOK by \"" + name + "\" in TINDER USER");
                        console.log("============================");
                        console.log("NAME(FACEBOOK): " + userInfo['name']);
                        console.log(res.misMatchPercentage + "% MISMATCHED");
                        console.log("============================");
                        console.log();
                        // 一致しないものは削除！
                        if (res.misMatchPercentage > 50) {
                            fse.removeSync(fbImageDir + userInfo['id'] + '.png');
                            fse.removeSync(fbImageDir + userInfo['id'] + '.jpg');
                        } else {
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                            console.log("%%                        %%");
                            console.log("%%    !!!! MATCH !!!!     %%");
                            console.log("%%                        %%");
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
                        }
                        next();
                    });
                }, function complete(err) {
                    if (err) console.error(err);
                    if (page != -1) {
                        console.log("~~~~~~~~~~~~~~~~~");
                        console.log("PAGE NO: " + page);
                        console.log("~~~~~~~~~~~~~~~~~");
                        me.searchWithFb(userId, name, page);
                    } else {
                        console.log("=~=~=~=~=~=~=~=~=~=~=~=");
                        console.log("end");
                        console.log("=~=~=~=~=~=~=~=~=~=~=~=");
                        fse.removeSync(tinderImageDir + userId + '.png');
                        fse.removeSync(tinderImageDir + userId + '.jpg');
                    }
                    return page;
                });
            }
        ])
    }
}

main.run();

module.exports = main;
