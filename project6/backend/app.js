var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userdataRouter = require('./routes/userdata');
var plansRouter = require('./routes/plans');
var coursesRouter = require('./routes/courses');
var plandataRouter = require('./routes/plandata');
var plancoursesRouter = require('./routes/plancourses');
var coursereqsRouter = require('./routes/coursereqs');

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/userdata', userdataRouter);
app.use('/plans', plansRouter);
app.use('/courses', coursesRouter);
app.use('/plandata', plandataRouter);
app.use('/plancourses', plancoursesRouter);
app.use('/coursereqs', coursereqsRouter);

module.exports = app;
