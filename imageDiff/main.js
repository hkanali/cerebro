var fs = require('fs');
var Q = require('q');


var fb = require('./modules/facebook');
var imageUtil = require('./modules/imageUtil');


var main = {
    start: function() {
        Q.nfcall(fs.readdir, '.')
        .then(function(files) {
            return Q.nfcall(fs.readFile, files[0], 'utf-8');
        })
        .then(function(data) {
            console.log(data);
        })
        .done();
    }
}

module.exports = main;
