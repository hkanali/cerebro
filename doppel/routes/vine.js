var express = require('express');
var router = express.Router();

var config = require('config');
var vineConf = config.get('vine');

var vineService = require('../modules/vine');

router.get('/', function(req, res, next) {
    vineService.countUsers(function(result) {
        res.render('vine/index', { title: 'Vine on Cerebro', userCount: result[0].count });
    });
});

router.post('/', function(req, res, next) {
    var targetUserId = req.body['targetUserId'];
    console.log('post!' + req.body);
    if (targetUserId) {
        vineService.getUsers(vineConf['username'], vineConf['password'], targetUserId);
    }
    vineService.countUsers(function(result) {
        res.render('vine/index', { title: 'Vine on Cerebro', userCount: result[0].count });
    });
});

module.exports = router;
