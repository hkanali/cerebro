var connection = require('./connection');
var tableName = 'VINNERS';

var vineConnection = {
    /**
     * userInfo: {
     *     followerCount: 1,
     *     userId:
     *      { [String: '1207512423138209792']
     *        s: 1,
     *        e: 18,
     *        c: [ 1, 2, 0, 7, 5, 1, 2, 4, 2, 3, 1, 3, 8, 2, 0, 9, 7, 9, 2 ] },
     *     private: 0,
     *     likeCount: 0,
     *     postCount: 0,
     *     explicitContent: 0,
     *     blocked: 0,
     *     verified: 0,
     *     loopCount: 0,
     *     avatarUrl: 'http://v.cdn.vine.co/r/avatars/C91CC1F0A71207619890094260224_pic-r-1430893223089e2365a0dcf.jpg.jpg?versionId=U0d5MwSL8uY_TyEJw6lXFQEX1g3CSy_8',
     *     authoredPostCount: 0,
     *     description: '',
     *     location: '',
     *     username: 'たーくや',
     *     vanityUrls: [],
     *     following: 0,
     *     blocking: 0,
     *     shareUrl: 'https://vine.co/u/1207512423138209792',
     *     profileBackground: '0x333333',
     *     notifyPosts: 0,
     *     followingCount: 25,
     *     repostsEnabled: 0 
     * }
     */
    select : function (id, callback) {
        connection.select(tableName, id, callback);
    },
    insert : function(userInfo, callback) {
        var now = new Date();
        connection.insert(tableName, createVinner(
            userInfo.userId.toString(),
            userInfo.username,
            userInfo.description,
            userInfo.location,
            userInfo.avatarUrl,
            userInfo.authoredPostCount,
            userInfo.followingCount,
            userInfo.followerCount,
            //userInfo.private,
            //userInfo.likeCount,
            //userInfo.postCount,
            //userInfo.explicitContent,
            //userInfo.blocked,
            //userInfo.verified,
            //userInfo.loopCount,
            //userInfo.following,
            //userInfo.blocking,
            //userInfo.shareUrl,
            now,
            now
        ), callback);
    },
    update : function (userInfo, callback) {
        var now = new Date();
        connection.update(tableName, createVinner(
            userInfo.userId.toString(),
            userInfo.username,
            userInfo.description,
            userInfo.location,
            userInfo.avatarUrl,
            userInfo.authoredPostCount,
            userInfo.followingCount,
            userInfo.followerCount,
            //userInfo.private,
            //userInfo.likeCount,
            //userInfo.postCount,
            //userInfo.explicitContent,
            //userInfo.blocked,
            //userInfo.verified,
            //userInfo.loopCount,
            //userInfo.following,
            //userInfo.blocking,
            //userInfo.shareUrl,
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

var createVinner = function (id, name, description, location, iconPath, postCount, followCount, followerCount, createdAt, updatedAt) {
    var mysql = require('mysql');
    return {
        id: id,
        name: name,
        description: description,
        location: location,
        icon_path: iconPath,
        post_count: postCount,
        follow_count: followCount,
        follower_count: followerCount,
        created_at: createdAt,
        updated_at: updatedAt
    };
};

module.exports = vineConnection;
