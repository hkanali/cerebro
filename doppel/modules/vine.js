var request = require('request');
var vine = require('../lib/vine');

var vineConnection = require('./vineConnection');

var nextPage = 1;

var myVine = {
    getUsers : function (username, password, targetUserId, page) {
        var self = this;
        vine.login(username, password, function(err, res) {
            self.getFollowers(username, password, targetUserId, page);
        });
    },
    getFollowers : function (username, password, userId, page) {
        var self = this;
        var options = {
            page: page,
            size: 1
        };
        vine.followers(userId, options, function(err, response) {
            if (err) {
                console.error(err);
                if (err.code == 420) {
                    console.log('[Vine] 出直してきます！その1');
                    setTimeout(function() {
                        self.getUsers(username, password, userId, nextPage);
                    }, 1000 * 60 * 30);
                }
                return;
            }

            if (!response || !response.nextPage) return;
            for (var i = 0; i < response.size; i++) {
                var followerUserId = response.records[i].userId;
                vine.profiles(followerUserId, function(err, userInfo) {
                    if (err) {
                        console.error(err);
                        if (err.code == 420) {
                            console.log('[Vine] 出直してきます！その2');
                            setTimeout(function() {
                                self.getUsers(username, password, userId, nextPage);
                            }, 1000 * 60 * 30);
                        }
                        // TODO FIXME ここcallback内なので、options.size = 1 にしないと大変なことになるんやで・・
                        return;
                    }
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
            nextPage = response.nextPage; 
            // 叩き過ぎるとはじかれちゃうう〜
            // 10秒だけ待ってやろう
            setTimeout(function() {
                self.getFollowers(username, password, userId, response.nextPage);
            }, 10000);
        });
    },
    countUsers : function (callback) {
        vineConnection.countUsers(callback);
    }
};

module.exports = myVine;
