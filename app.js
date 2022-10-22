var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var FileStore = require('session-file-store')(session);
const mongoose = require('mongoose');
var passport = require('passport');
var authenticate = require('./src/authenticate');
var config = require('./src/config');
const Dishes = require('./src/models/dishes');

const url = process.env.MONGODB_URI || config.mongoUrl;
const connect = mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

connect.then((db) => {
  console.log("Connected correctly to server");
}, (err) => { console.log(err); });

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');
var dishRouter = require('./src/routes/dishRouter');
var promoRouter = require('./src/routes/promoRouter');
var leaderRouter = require('./src/routes/leaderRouter');
const favoriteRouter = require("./src/routes/favoriteRouter");
var commentRouter = require('./src/routes/commentRouter');
const feedbackRouter = require("./src/routes/feedbackRouter");
const uploadRouter = require('./src/routes/uploadRouter');

var app = express();

// Secure traffic only
// app.all('*', (req, res, next) => {
//   if (req.secure) {
//     return next();
//   }
//   else {
//     res.redirect(307, 'https://' + req.hostname + ':' + app.get('secPort') + req.url);
//   }
// });

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("12345-67890-09876-54321"));
app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  saveUninitialized: false,
  resave: false,
  // store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/imageUpload',uploadRouter);

app.use(express.static(path.join(__dirname, './client/build')));

app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/comments', commentRouter);
app.use("/favorites", favoriteRouter);
app.use("/feedback", feedbackRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  let message = err.message;
  let error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    message, error
  });
});

module.exports = app;
