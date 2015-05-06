var connection = require('./connection');
var tableName = 'INSTAGRAMERS';

var instagramConnection = {
    /**
     * userInfo: {
     *     username: "username",
     *     bio: "biobiobiobio",
     *     website: "http://......",
     *     profile_picture: "https://......jpg",
     *     full_name: "fullname",
     *     counts: {
     *         media: 1000, <- 投稿数
     *         followed_by: 1000,
     *         follows: 1000
     *     },
     *     id: "1813926059"
     * }
     */
    select : function (id, callback) {
        connection.select(tableName, id, callback);
    },
    insert : function(userInfo, callback) {
        var now = new Date();
        connection.insert(tableName, createInstagramer(
            userInfo.id,
            userInfo.username,
            userInfo.full_name,
            userInfo.bio,
            userInfo.website,
            userInfo.profile_picture,
            userInfo.counts.media,
            userInfo.counts.follows,
            userInfo.counts.followed_by,
            now,
            now
        ), callback);
    },
    update : function (userInfo, callback) {
        var now = new Date();
        connection.update(tableName, createInstagramer(
            userInfo.id,
            userInfo.username,
            userInfo.full_name,
            userInfo.bio,
            userInfo.website,
            userInfo.profile_picture,
            userInfo.counts.media,
            userInfo.counts.follows,
            userInfo.counts.followed_by,
            null,
            now
        ), callback);
    },
    delete : function (id) {
    },
    countUsers : function (callback) {
        connection.getConnection(function(err, connection) {
            var query = connection.query('SELECT count(id) as count from ' + tableName, function(err, result) {
                if (err) console.error(err);
                callback(result);
                connection.release();
            });
            console.log(query.sql);
        });
    }
};

var createInstagramer = function (id, name, fullname, description, website, iconPath, postCount, followCount, followerCount, createdAt, updatedAt) {
    var mysql = require('mysql');
    return {
        id: id,
        name: name,
        full_name: fullname,
        description: description,
        website: website,
        icon_path: iconPath,
        post_count: postCount,
        follow_count: followCount,
        follower_count: followerCount,
        created_at: createdAt,
        updated_at: updatedAt
    };
};

module.exports = instagramConnection;
