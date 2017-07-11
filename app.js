var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

var user = require('./models/user');

var verifyDashboardRequest = require('./utils/dashboard-request-verification');
var verifyInstructor = require('./utils/verify-instructor');
var verifyStudent = require('./utils/verify-student');

var config = require('./config');

// mongoose.Promise = global.Promise;
// mongoose.Promise = require('bluebird');

mongoose.connect(config.mongoUrl);
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',function(){
	console.log("Connected correctly to server");
});

var index = require('./routes/index');
var users = require('./routes/users');
var students = require('./routes/students');
var instructors = require('./routes/instructors');

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// add file upload middleware
// app.use(fileUpload());

app.use(passport.initialize());
passport.use(user.createStrategy());
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// app.use('/', index);
app.use('/users', users);
// app.use('/student',index);
app.use('/students',students);
app.use('/instructors',instructors);

app.use(verifyDashboardRequest);
app.use(express.static(path.join(__dirname, 'public/src/dashboard')));

app.use(verifyInstructor);
app.use(express.static(path.join(__dirname, 'public/src/instructor/home-main')));

app.use(verifyStudent);
app.use(express.static(path.join(__dirname, 'public/src/student/home-main')));

app.use(express.static(path.join(__dirname, 'public')));

// catch 404 and forward to error handler
app.use(function(err,req, res, next) {
	if(err.status == 404){
		res.status(404).json(err);
	}else{
		next(err);
	}
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  console.log("Error occurs:"+err);
  console.log(err.stack);
  res.status(err.status || 500).
	json(err.data);
});

module.exports = app;
