if(process.env.NODE_ENV !=='production'){
  require('dotenv').config();
}
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authorRouter = require('./routes/authors');
var bookRouter = require('./routes/books');
var expressLayouts = require('express-ejs-layouts');
var app = express();
var bodyParser  = require('body-parser');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.set('layout' , 'layouts/layout');
app.use(expressLayouts);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//bodyParser setting
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit : '50mb' , extended: false}));

//router setting
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/authors',authorRouter);
app.use('/books',bookRouter);
// mongoose setting
var mongoose = require('mongoose');
  mongoose.connect(process.env.DATABASE_URL , {
    useNewUrlParser : true
  });
var db = mongoose.connection
db.on('error' , error => console.error(error));
db.once('open' , () => console.error('success'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(process.env.PORT || 7000);
module.exports = app;
