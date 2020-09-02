var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var auth = require('./middlewares/auth')
var mongoose = require('mongoose')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
var passport = require('passport')

var app = express();

// connecting to mongoDB
const url = 'mongodb://127.0.0.1:27017/confusion'
mongoose.connect(url)
  .then(db => {
      console.log('successfully connect to server')
  })

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// configuration
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser("somebodythatiusedtoknow"))


app.use(passport.initialize())

// redirect all routes to HTTPS
// app.all('*', (req, res, next) => {
//   if (req.secure) return next()
//   else {
//     res.redirect(307, `https://${req.hostname}:${app.get('secPort')}${req.url}`)
//     console.log(`redirect to https://${req.hostname}:${app.get('secPort')}${req.url}`)
//   }
// })

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/failure', (req, res, next) => {
  res.send('fail to authenticate')
})
app.use('/favorites', require('./routes/favorites'))

app.use(express.static(path.join(__dirname, 'public')));
app.use('/upload', require('./routes/upload'))
app.use('/dishes' ,require('./routes/dishesRouter'))
app.use('/promotions', require('./routes/promotionsRouter'))
app.use('/leaders', require('./routes/leadersRouter'))

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

module.exports = app;
