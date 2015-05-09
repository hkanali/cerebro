var request = require('request');
var async = require('async');
var vine = require('../lib/vine');

var vineConnection = require('./vineConnection');

var nextPage = 1;

var myVine = {
    getUsers : function (username, password, targetUserId, page) {
        // apiのmax 500以上ページングできない！
        if (page > 500) {
            return;
        }
        var self = this;
        vine.login(username, password, function(err, res) {
            self.getFollowers(username, password, targetUserId, page);
        });
    },
    getFollowers : function (username, password, userId, page) {
        var self = this;
        var options = {
            page: page,
            size: 100 // apiのmax
        };
        async.waterfall([
                // フォロワー100人取得
                function (callback) {
                    vine.followers(userId, options, function(err, response) {
                        if (err) {
                            console.error(err);
                            /*
                            if (err.code == 420) {
                                console.log('[Vine] 出直してきます！その1');
                                setTimeout(function() {
                                    self.getUsers(username, password, userId, nextPage);
                                }, 1000 * 10);// * 60 * 30);
                            }
                            */
                            return;
                        }
                        if (!response || !response.nextPage) return;
                        callback(null, response);
                    });
                },
                // 取得した100人のuserInfoを一人ずつ取得
                function (response, waterfallCallback) {
                    async.eachSeries(response.records, function(follower, eachCallback){
                        var followerUserId = follower.userId.toString();
                        vine.profiles(followerUserId, function(err, userInfo) {
                            if (err) {
                                console.error(err);
                                /*
                                if (err.code == 420) {
                                    console.log('[Vine] 出直してきます！その2');
                                    setTimeout(function() {
                                        self.getUsers(username, password, userId, nextPage);
                                    }, 1000 * 10);// * 60 * 30);
                                }
                                */
                                return;
                            }

                            vineConnection.select(userInfo.userId.toString(), function(res) {
                                if (!res) {
                                    vineConnection.insert(userInfo, function (res) {
                                        console.log('[Vine] inserted userInfo: ' + userInfo.userId.toString());
                                        eachCallback();
                                    });
                                } else {
                                    vineConnection.update(userInfo, function (res) {
                                        console.log('[Vine] updated userInfo: ' + userInfo.userId.toString());
                                        eachCallback();
                                    });
                                }
                            });
                        });
                    }, function(err){
                        if(err) console.error(err);
                    });
                    waterfallCallback(null, response.nextPage);
                },
                // 次のページへ
                function (nextPage) {
                    // 非同期制御できない・・・ 5分待つ
                    setTimeout(function() {
                        console.log('[Vine] get followers of ' + userId + ', page: ' + nextPage);
                        self.getFollowers(username, password, userId, nextPage);
                    }, 1000 * 60 * 5);
                }
        ], function (err) {
            console.error(err);
        });
    },
    countUsers : function (callback) {
        vineConnection.countUsers(callback);
    }
};

module.exports = myVine;
