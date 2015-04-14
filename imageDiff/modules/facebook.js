var graph = require('fbgraph');

var facebook = {
    login: function(accessToken) {
        graph.setAccessToken(accessToken);
    },
    searchUsersByName: function(name, page, callback) {
        if (!page || page < 0) page = 1;
        var limit = 100;
        var offset = limit * (page -1);
        var searchOptions = {
            q : name,
            type : 'user',
            limit : limit,
            offset : offset
        };
        return graph.search(searchOptions, callback);
    },
    getUserProfilePicUri : function(userId, callback) {
        return graph.get(userId + '?fields=id,name,birthday,bio,address,email,picture.type(large)', callback);
    }
}

module.exports = facebook;
