var config = require('config');
var mysql = require('mysql');

var utils = require('./utils');

var dbConfig = config.get('db');
var pool = mysql.createPool({
    host: dbConfig.hostName,
    user: dbConfig.userName,
    password: dbConfig.password,
    database: dbConfig.dbName
});

var connection = {
    select : function (tableName, id, callback) {
        pool.getConnection(function(err, connection) {
            var query = connection.query('SELECT * FROM ' + tableName + ' WHERE id = ?', [id], function(err, results) {
                if (err) console.error(err);
                callback(results.length ? results[0] : null);
                connection.release();
            });
            console.log(query.sql);
        });
    },
    insert : function (tableName, entity, callback) {
        pool.getConnection(function(err, connection) {
            var query = connection.query('INSERT INTO ' + tableName + ' SET ?', entity, function(err, result) {
                if (err) console.error(err);
                callback(result);
                connection.release();
            });
            console.log(query.sql);
        });
    },
    update : function (tableName, entity, callback) {
        pool.getConnection(function(err, connection) {
            var query = connection.query('UPDATE ' + tableName + ' SET ? WHERE id=' + entity.id, utils.deleteNullFields(entity), function(err, result) {
                if (err) console.error(err);
                callback(result);
                connection.release();
            });
            console.log(query.sql);
        });
    },
    delete : function (tableName, id) {
    }
};

module.exports = connection;
