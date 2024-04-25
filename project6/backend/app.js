// Notes:
// * Kai responsible for auth.js
// * Logan responsible for student.js, plans.js, faculty.js, save.js

var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var authRouter = require('./routes/auth');
var facultyRouter = require('./routes/faculty');
var studentRouter = require('./routes/student');
var planRouter = require('./routes/plan');
var saveRouter = require('./routes/save');

var app = express();

var corsOptions = {
    origin: 'http://localhost:5173', // NOTE: make sure client is running on port 5173
    optionsSuccessStatus: 200,
    methods: "GET, POST"
}

app.use(cors(corsOptions))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth', authRouter);
app.use('/faculty', facultyRouter);
app.use('/student', studentRouter);
app.use('/plan', planRouter);
app.use('/save', saveRouter);

module.exports = app;
