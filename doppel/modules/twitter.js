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
            if (tweet.text.match("/RT/")) return;
            // ハッシュタグも弾こうかな
            if (tweet.entities.hashtags.length != 0) return;

            var photoUrls = null;
            if (tweet.extended_entities && tweet.extended_entities.media) {
                photoUrls = getPhotoUrls(tweet);
            }

            tweetByDoppel(tweet, photoUrls);
        });

        stream.on('error', function(error) {
            console.log(error);
        });
    });
};

var getPhotoUrls = function(tweet) {
    // 画像以外は対応してません！
    if(!tweet.extended_entities || !tweet.extended_entities.media) return null;
    var media = tweet.extended_entities.media;
    var photoUrls = [];
    for (var i = 0; i < media.length; i++) {
        if (media[i].type == 'photo') {
            photoUrls.push(media[i].media_url);
        }
    }
    return photoUrls;
}

var tweetByDoppel = function(tweet, photoUrls) {
    var doppels = getDoppels();
    for (var i = 0; i < doppels.length; i++) {
        if (tweet.user.id == doppels[i]['id']) {
            if (photoUrls == null) {
                // 画像無し
                postTweet(doppels[i]['client'], tweet.text);
            } else {
                // 画像有り
                postTweetWithPhotos(doppels[i]['client'], tweet.text, photoUrls);
            }
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

var postTweetWithPhotos = function(client, tweetText, photoUrls) {
    // Load your image
    // TODO 一つだけ
    var request = require('request');
    var fse = require('fs-extra');
    var fs = require('fs');

    var photoUrl = photoUrls[0];
    var tmpDir = './tmp/';

    // TODO jpg以外あるのかな?
    request(photoUrl).pipe(fs.createWriteStream(tmpDir + 'image.jpg')).on('finish', function() {
        var data = fs.readFileSync(tmpDir + 'image.jpg');
        // Make post request on media endpoint. Pass file data as media parameter
        client.post('media/upload', {media: data}, function(error, media, response){

            fse.removeSync(tmpDir + 'image.jpg');

            if (!error) {

                // If successful, a media object will be returned.
                console.log(media);

                // Lets tweet it
                var status = {
                    status: tweetText,
                    media_ids: media.media_id_string // Pass the media id string
                }

                client.post('statuses/update', status, function(error, tweet, response){
                    if (!error) {
                        console.log(tweet);
                    }
                });
            }
        });
    });
}


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
