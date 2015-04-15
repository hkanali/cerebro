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
    convertImage200200: function(orig, dest, callback) {
        gm(orig).resize('200', '200').noProfile().write(dest, callback);
    },
    compareImages: function(image1, image2, callback) {
        resemble(image1).compareTo(image2).onComplete(callback);
    }
}

module.exports = util;
