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
            userInfo.bio,
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
            userInfo.bio,
            userInfo.profile_picture,
            userInfo.counts.media,
            userInfo.counts.follows,
            userInfo.counts.followed_by,
            null,
            now
        ), callback);
    },
    delete : function (id) {
    }
};

var createInstagramer = function (id, name, description, iconPath, postCount, followCount, followerCount, createdAt, updatedAt) {
    var mysql = require('mysql');
    return {
        id: id,
        name: name,
        description: description,
        icon_path: iconPath,
        post_count: postCount,
        follow_count: followCount,
        follower_count: followerCount,
        created_at: createdAt,
        updated_at: updatedAt
    };
};

module.exports = instagramConnection;
