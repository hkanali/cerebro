var request = require('request');
var vine = require('../lib/vine');

var vineConnection = require('./vineConnection');

var myVine = {
    getUsers : function (username, password, targetUserId) {
        var self = this;
        vine.login(username, password, function(err, res) {
            self.getFollowers(targetUserId, null);
        });
    },
    // TODO privateにする！
    getFollowers : function (userId, page) {
        var self = this;
        var options = {
            page: page,
            size: 1
        };
        vine.followers(userId, options, function(err, response) {
            if (err) console.log(err);
            if (!response || !response.nextPage) return;
            for (var i = 0; i < response.size; i++) {
                var followerUserId = response.records[i].userId;
                vine.profiles(followerUserId, function(err, userInfo) {
                    vineConnection.select(userInfo.userId.toString(), function(res) {
                        if (!res) {
                            vineConnection.insert(userInfo, function (res) {
                                console.log('[Vine] inserted userInfo: ' + userInfo.userId.toString());
                            });
                        } else {
                            vineConnection.update(userInfo, function (res) {
                                console.log('[Vine] updated userInfo: ' + userInfo.userId.toString());
                            });
                        }
                    });
                });
            }
            // 叩き過ぎるとはじかれちゃうう〜
            // 10秒だけ待ってやろう
            setTimeout(function() {
                self.getFollowers(userId, response.nextPage);
            }, 10000);
        });
    },
    countUsers : function (callback) {
        vineConnection.countUsers(callback);
    }
};

module.exports = myVine;
