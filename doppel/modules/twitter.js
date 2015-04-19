var Twitter = require('twitter');
var config = require('config');

var createClient = function (appKeys) {
    var client = new Twitter({
        consumer_key: appKeys.consumerKey,
        consumer_secret: appKeys.consumerSecret,
        access_token_key: appKeys.accessTokenKey,
        access_token_secret: appKeys.accessTokenSecret
    });
    return client;
};

var getDoppels = function() {
    var doppels = [];
    var doppelUsers = config.get('doppelUsers');

    for (var i = 0; i < doppelUsers.length; i++) {
        var doppel = {};
        doppel['id'] = doppelUsers[i]['targetUser']['id'];
        doppel['client'] = createClient(doppelUsers[i].user.appKeys);
        doppels.push(doppel);
    }
    return doppels;
};

var observeStream = function(client) {
    var streamConf = config.get('stream.filter');

    var parameters = {
        follow: createTargetUsersIds(),
        //locations: streamConf.locations,
        language: streamConf.language,
        replies: streamConf.replies
    };
    client.stream('statuses/filter', parameters,  function(stream) {
        stream.on('data', function(tweet) {
            //if (tweet.user.id == 1958099358) console.log(tweet);
            // replyは弾く
            if (tweet.in_reply_to_screen_name != null) return;
            // 公式RTを弾く => 流れてこないです
            // 非公式RTを弾く RT先のリンクが入る
            if (tweet.entities.urls.length != 0) return;
            // ハッシュタグも弾こうかな
            if (tweet.entities.hashtags.length != 0) return;
            // 添付ファイル（画像・動画）も新しく生成したいな
            // tweet.extended_entities.media の中に入ってる
            // TODO 画像くらいなら新しく添付して投稿
            if (tweet.extended_entities) return;

            tweetByDoppel(tweet);
        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });
};

var tweetByDoppel = function(tweet) {
    var doppels = getDoppels();
    for (var i = 0; i < doppels.length; i++) {
        if (tweet.user.id == doppels[i]['id']) {
            postTweet(doppels[i]['client'], tweet.text);
        }
    }
};

var postTweet = function(client, tweetText) {
    client.post('statuses/update', {status: tweetText}, function(error, tweet, response) {
        if (!error) {
            console.log(tweet);
        }
    });
};


var createTargetUsersIds = function() {
    var doppelUsers = config.get('doppelUsers');
    var ids = "";
    for (var i = 0; i< doppelUsers.length; i++) {
        ids += doppelUsers[i]['targetUser']['id'] + ',';
    }
    return ids.slice(0, -1);
};

var twitter = {
    test: function() {
        var appKeys = config.get('observerKeys');
        observeStream(createClient(appKeys));
    }
};

twitter.test();

module.exports = twitter;
