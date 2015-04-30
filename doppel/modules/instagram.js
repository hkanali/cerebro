var Nightmare = require('nightmare');

var instagram = {
    getInstaUrls : function(urls) {
        var instagramUrls = [];
        for (var i = 0; i < urls.length; i++) {
            if (urls[i].expanded_url.match(/instagram.com/)) {
                instagramUrls.push(urls[i].expanded_url);
            }
        }
        return instagramUrls;
    },

    getInstaPhotoUrl : function(url, callback) {
        console.log('open instagram url: ' + url);
        new Nightmare()
            .goto(url)
            .wait(5000)
            .evaluate(function() {
                return document.querySelector('#react-root > div > div > div > div > div > div > div > div > div > div.iMedia.LikeableFrame > div').getAttribute('src');
            },
            function(photoUrl) {
                callback(photoUrl);
            })
            .run(function (err, nightmare) {
                if (err) console.log(err);
            });
    }
};

module.exports = instagram;
