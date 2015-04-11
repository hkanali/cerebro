var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

var request = require('request');
var fs = require('fs');

var resemble = require('resemble').resemble;

var gm = require('gm');

// callback warota
req1 = request('https://raw.githubusercontent.com/Huddle/Resemble.js/master/demoassets/People.jpg').pipe(fs.createWriteStream('image/People.jpg'));

req1.on('finish', function() {
    req2 = request('https://raw.githubusercontent.com/Huddle/Resemble.js/master/demoassets/People2.jpg').pipe(fs.createWriteStream('image/People2.jpg'));
    req2.on('finish', function() {
        gm('image/People.jpg').noProfile().write('image/output/People.png', function (err) {
            if (!err) {
                gm('image/People2.jpg').noProfile().write('image/output/People2.png', function (err) {
                    if (!err) {
                        console.log('done');
                        var diff = resemble('image/output/People.png').compareTo('image/output/People2.png').onComplete(function(data){
                            console.log(data);
                        });
                    }
                });
            }
        });
    });
});


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
