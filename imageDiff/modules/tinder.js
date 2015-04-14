var tinder = require('tinderjs');
var client = new tinder.TinderClient();

var tinder = {
    authorize: function(FB_ID, FB_TOKEN, callback) {
        return client.authorize(FB_ID, FB_TOKEN, callback);
    }
}

module.exports = tinder;
