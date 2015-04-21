var request = require('request');

var wakeup = function(url, time) {
    setInterval(function() {
        request.get(url, function(err, res, body){
            if(!err && res.statusCode == 200) {
                console.log('!!!! WAKE UP !!!!');
            }
        });
    }, time);
}

var heroku = {
    init: function(url, time) {
        wakeup(url, time);
    }
};

module.exports = heroku;
