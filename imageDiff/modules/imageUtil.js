var fs = require('fs');
var request = require('request');
var gm = require('gm');

var resemble = require('resemble').resemble;

var util = {
    saveImage: function (url, savedName) {
        return request(url).pipe(fs.createWriteStream(savedName));
    },
    convertImage: function(orig, dest, callback) {
        gm(orig).noProfile().write(dest, callback);
    },
    compareImages: function(image1, image2, callback) {
        resemble(image1).compareTo(image2).onComplete(callback);
    }
}

module.exports = util;

// callback warota
/*

req1.on('finish', function() {
    req2 = request('https://raw.githubusercontent.com/Huddle/Resemble.js/master/demoassets/People2.jpg').pipe(fs.createWriteStream('image/People2.jpg'));
    req2.on('finish', function() {
        gm('image/People.jpg').noProfile().write('image/output/People.png', function (err) {
            if (!err) {
                gm('image/People2.jpg').noProfile().write('image/output/People2.png', function (err) {
                    if (!err) {
                        console.log('done');
                        var diff = resemble('image/output/People.png').compareTo('image/output/People2.png').onComplete(function(data){
                            console.log(data);
                        });
                    }
                });
            }
        });
    });
});
*/
