var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var SqlString = require('sqlstring');

var bodyParser = require('body-parser');
const app = express();

// set up rate limiter: maximum of five requests per minute
var RateLimit = require('express-rate-limit');
var limiter = new RateLimit({
  windowMs: 1*60*1000, // 1 minute
  max: 5
});

// apply rate limiter to all requests
app.use(limiter);
//body parser setup
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({ extended: true }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/database', function (req, res, next) {
  var body = req.body.query
  let sql = "SELECT Price,Description,Image FROM 'store' WHERE 'name' LIKE '"+SqlString.escape(body)+"'"
  var sqlite = require('sqlite3');
  let db = new sqlite.Database('./db/Store.db')
  var data = [];
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    rows.forEach((row) => {
      data.push(row.name);
    });
  });
  res.send(data)
});


// catch 404 and forward to error handler
//app.use(function(req, res, next) {
  //next(createError(404));
//});

// error handler
//app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  //res.locals.message = err.message;
  //res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  //res.status(err.status || 500);
  //res.render('error');
//});
app.get('/', function (req, res, next) {
   res.sendFile(path.join(__dirname, 'views')+'/index.html')
});

app.get('/store', function (req, res, next) {
  res.sendFile(path.join(__dirname, 'views')+'/store.html')
});

module.exports = app;
