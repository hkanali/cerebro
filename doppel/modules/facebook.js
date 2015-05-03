var Nightmare = require('nightmare');
var graph = require('fbgraph');
var utils = require('./utils');

var facebook = {
    postByDoppel: function(doppelUsers, tweet, photoUrls) {
        var self = this;
        if (photoUrls == null || photoUrls.length == 0) {
            return;
        }
        if (photoUrls[0] == '') {
            console.log('[Facebook] photoUrl is Empty');
            return;
        }

        for (var i = 0; i < doppelUsers.length; i++) {
            if (doppelUsers[i]['targetUser']['twitterId'] == tweet.user.id) {
                var username = doppelUsers[i]['facebook']['username'];
                var password = doppelUsers[i]['facebook']['password'];
                if (username == null || username == '') return;
                if (password == null || password == '') return;
//                self.post(username, password, tweet.text, photoUrls);
                var postData =  {
                    message: utils.trimUrl(tweet.text),
                    url: photoUrls[0]
                };
                self.postWithApp(875627165813597, username, password, postData);
            }
        }

    },

    post: function(username, password, content, photoUrls) {
        console.log('[Facebook] login');
        new Nightmare()
            .goto('https://www.facebook.com')
            .wait(5000)
            .type('input[name="email"]', username)
            .type('input[name="pass"]', password)
            .click('#loginbutton')
            .wait(5000)
            /*
               .evaluate(function() {
               return document.title;
               },
               function(result) {
               console.log(result);
               })
               */
            .type('textarea', utils.trimUrl(content) + '\n' + utils.createPhotoUrlsForView(photoUrls))
            //.wait(10000) // ここでプレビュー出したいけどうまくいかない
            .click('form > div > div > div > ul > li:nth-child(2) > button')
            .run(function (err, nightmare) {
                if (err) console.error(err);
                console.log('[Facebook] post completed!');
            });
    },
    /**
     * postData = {
     *     message: message,
     *     url: url
     * }
     */
    postWithApp : function(appId, username, password, postData) {
        var self = this;
        new Nightmare()
            .goto('https://www.facebook.com/login.php?next=https%3A%2F%2Fdevelopers.facebook.com%2Ftools%2Fexplorer%2F' + appId + '%2F%3Fmethod%3DGET%26path%3Dme%253Ffields%253Did%252Cname%26version%3Dv2.3')
            .type('input[name="email"]', username)
            .type('input[name="pass"]', password)
            .click('#loginbutton')
            .wait(10000)
            .evaluate(function() {
                return document.querySelector('#gx-auth > div > label > input').value;
            }, function (token) {
                console.log('[Facebook] got token!');
                self.postWithGraph(token, postData);
            })
            .run(function (err, nightmare) {
                if (err) console.error(err);
                console.log('[Facebook] post completed!');
            });
            
    },
    postWithGraph : function (token, postData) {
        graph.post('me/photos', {access_token: token, message: postData.message, url: postData.url}, function(err, res) {
            // returns the post id
            console.log('[Facebook] postId: ' + res.id);
        });
    }
};

module.exports = facebook;

