var config = require('config');
var twitterService = require('./modules/twitter');
var facebookService = require('./modules/facebook');
var instagramService = require('./modules/instagram');

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
                if (tweet.text.match(/@/)) return;

                // 添付リンクがある(非公式RT含む)且つ、インスタが含まれない
                var instagramUrls = instagramService.getInstaUrls(tweet.entities.urls);
                if (tweet.entities.urls.length != 0 && instagramUrls.length == 0) return;

                if (tweet.text.match(/RT/)) return;
                // ハッシュタグも弾こうかな
                if (tweet.entities.hashtags.length != 0) return;

                var photoUrls = null;
                // twitterの添付画像を優先
                if (tweet.extended_entities && tweet.extended_entities.media) {
                    photoUrls = twitterService.getPhotoUrls(tweet);

                    twitterService.tweetByDoppel(doppelUsers, tweet, photoUrls);
                    facebookService.postByDoppel(doppelUsers, tweet, photoUrls);
                    console.log('with twitter photo');

                } else if (instagramUrls.length != 0) {
                    // インスタがあればそれを添付
                    instagramService.getInstaPhotoUrl(instagramUrls[0], function(url) {
                        twitterService.tweetByDoppel(doppelUsers, tweet, [url]);
                        facebookService.postByDoppel(doppelUsers, tweet, [url]);
                        console.log('with instagram photo');
                    });
                } else {
                    twitterService.tweetByDoppel(doppelUsers, tweet, photoUrls);
                    facebookService.postByDoppel(doppelUsers, tweet, photoUrls);
                    console.log('no photo');
                }
            });

            stream.on('error', function(error) {
                console.error(error);
            });
        });
    },

};

main.run();

exports.module = main;
