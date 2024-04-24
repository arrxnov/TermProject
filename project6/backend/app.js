// TODO: add post apis to update notes, planned courses
// Notes:
// * Kai responsible for auth.js
// * Logan responsible for student.js, plans.js, faculty.js

var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var facultyRouter = require('./routes/faculty');
var studentRouter = require('./routes/student'); 

var app = express();

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/faculty', facultyRouter);
app.use('/student', studentRouter);

module.exports = app;
