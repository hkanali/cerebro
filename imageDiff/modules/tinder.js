var tinder = require('tinderjs');
var client = new tinder.TinderClient();

var tinder = {
    authorize: function(FB_TOKEN, FB_ID, callback) {
        client.authorize(FB_TOKEN, FB_ID, callback);
    },
    getHistory: function(callback) {
        client.getHistory(callback);
    }
}

module.exports = tinder;
