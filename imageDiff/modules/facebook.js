var graph = require('fbgraph');

var accessToken = '';

var facebook = {
    login: function () {
        graph.setAccessToken(accessToken);
    },

    searchUsersByName: function(name) {
        var searchOptions = {
            q : name,
            type : 'user'
        };
        graph.search(searchOptions, function(err, res) {
            return err ? err : res.data;
        });
    },

    getUserProfilePicUri : function(userId) {
        graph.get(userId + '/picture', function(err, res) {
            if (res.image) {
                return res.location;
            }
            return null;
        });
    },

    faceboooook: function(name) {
        graph.setAccessToken(accessToken);
        var searchOptions = {
            q : name,
            type : 'user'
        };
        graph.search(searchOptions, function(err, res) {
            var users = res.data;
            for (i = 0; i < users.length; i++) {
                var userId = users[i]['id'];
                var name = users[i]['name'];
                graph.get(userId + '?fields=id,name,birthday,bio,address,email,picture.type(large)', function(err, res) {
                    console.log(res);
                });
            }
        });
    }

}

module.exports = facebook;

