var utils = {
    trimUrl : function(orig) {
        var res = '';
        origElements = orig.split(' ');
        for (var i = 0; i < origElements.length; i++) {
            if (!origElements[i].match(/http/)) {
                res += origElements[i] + ' ';
            } else {
                continue;
            }
        }
        return res.slice(0, -1);
    },

    createPhotoUrlsForView: function(photoUrls) {
        var res = '';
        for (var i = 0; i < photoUrls.length; i++) {
            res += photoUrls[i] + '\n';
        }
        return res;
    }
};

module.exports = utils;
