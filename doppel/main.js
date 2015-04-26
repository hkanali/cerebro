var config = require('config');
var twitterService = require('./modules/twitter');
var facebookService = require('./modules/facebook');

var main = {
    run : function() {
        var appKeys = config.get('observerKeys');
        var doppelUsers = config.get('doppelUsers');
        this.observeStream(twitterService.createClient(appKeys), doppelUsers);
    },

    observeStream : function(client, doppelUsers) {
        var streamConf = config.get('stream.filter');

        var parameters = {
            follow: twitterService.createTargetUsersIds(doppelUsers),
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
                if (tweet.text.match(/RT/)) return;
                // ハッシュタグも弾こうかな
                if (tweet.entities.hashtags.length != 0) return;

                var photoUrls = null;
                if (tweet.extended_entities && tweet.extended_entities.media) {
                    photoUrls = twitterService.getPhotoUrls(tweet);
                }

                twitterService.tweetByDoppel(doppelUsers, tweet, photoUrls);
                facebookService.postByDoppel(doppelUsers, tweet, photoUrls);
            });

            stream.on('error', function(error) {
                console.error(error);
            });
        });
    },

};

main.run();

exports.module = main;
