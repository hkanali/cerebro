var Nightmare = require('nightmare');
var utils = require('./utils');

var facebook = {
    postByDoppel: function(doppelUsers, tweet, photoUrls) {
        var self = this;
        if (photoUrls == null || photoUrls.length == 0) {
            return;
        }
        for (var i = 0; i < doppelUsers.length; i++) {
            if (doppelUsers[i]['targetUser']['twitterId'] == tweet.user.id) {
                var username = doppelUsers[i]['facebook']['username'];
                var password = doppelUsers[i]['facebook']['password'];
                if (username == null || username == '') return;
                if (password == null || password == '') return;
                self.post(username, password, tweet.text, photoUrls);
            }
        }

    },

    post: function(username, password, content, photoUrls) {
        console.log('login FB');
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
                if (err) console.log(err);
                console.log('FB post Completed!');
            });
    }
};

module.exports = facebook;

