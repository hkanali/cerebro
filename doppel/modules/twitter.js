var Twitter = require('twitter');
var utils = require('./utils');

var twitterService = {

    createClient : function (appKeys) {
        var client = new Twitter({
            consumer_key: appKeys.consumerKey,
            consumer_secret: appKeys.consumerSecret,
            access_token_key: appKeys.accessTokenKey,
            access_token_secret: appKeys.accessTokenSecret
        });
        return client;
    },

    getDoppels : function(doppelUsers) {
        var self = this;
        var doppels = [];

        for (var i = 0; i < doppelUsers.length; i++) {
            var doppel = {};
            doppel['id'] = doppelUsers[i]['targetUser']['twitterId'];
            doppel['client'] = self.createClient(doppelUsers[i].twitter.appKeys);
            doppels.push(doppel);
        }
        return doppels;
    },

    getPhotoUrls : function(tweet) {
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
    },

    tweetByDoppel : function(doppelUsers, tweet, photoUrls) {
        var doppels = this.getDoppels(doppelUsers);
        for (var i = 0; i < doppels.length; i++) {
            if (tweet.user.id == doppels[i]['id']) {
                if (photoUrls == null) {
                    // 画像無し
                    this.postTweet(doppels[i]['client'], tweet.text);
                } else {
                    // 画像有り
                    this.postTweetWithPhotos(doppels[i]['client'], tweet.text, photoUrls);
                }
            }
        }
    },

    postTweet : function(client, tweetText) {
        client.post('statuses/update', {status: tweetText}, function(error, tweet, response) {
            if (!error) {
                console.log('[Twitter] user: ' + tweet['user']['screen_name'] + ', text: ' + tweet.text);
            }
        });
    },

    postTweetWithPhotos : function(client, tweetText, photoUrls) {
        // Load your image
        // TODO 一つだけ
        var request = require('request');
        var fse = require('fs-extra');
        var fs = require('fs');

        var photoUrl = photoUrls[0];
        if (photoUrl == '') {
            console.log('[Twitter] photoUrl is Empty');
            return;
        }
        var tmpDir = './tmp/';

        // TODO jpg以外あるのかな?
        request(photoUrl).pipe(fs.createWriteStream(tmpDir + 'image.jpg')).on('finish', function() {
            var data = fs.readFileSync(tmpDir + 'image.jpg');
            // Make post request on media endpoint. Pass file data as media parameter
            client.post('media/upload', {media: data}, function(error, media, response){

                fse.removeSync(tmpDir + 'image.jpg');

                if (!error) {

                    // If successful, a media object will be returned.
                    // console.log(media);

                    // Lets tweet it
                    var status = {
                        status: utils.trimUrl(tweetText),
                        media_ids: media.media_id_string // Pass the media id string
                    }

                    client.post('statuses/update', status, function(error, tweet, response){
                        if (!error) {
                            console.log('[Twitter] user: ' + tweet['user']['screen_name'] + ', text: ' + tweet.text);
                        }
                    });
                }
            });
        });
    },

    createTargetUsersIds : function(doppelUsers) {
        var ids = "";
        for (var i = 0; i < doppelUsers.length; i++) {
            ids += doppelUsers[i]['targetUser']['twitterId'] + ',';
        }
        return ids.slice(0, -1);
    }

}

module.exports = twitterService;
