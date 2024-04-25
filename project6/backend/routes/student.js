var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

// Path: /student/studentdata/<session_id>/<student_id (optional if student signed in)>
router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];

        let sql = "SELECT name, gpa, major_gpa, default_plan_id FROM user WHERE id = ?";
        zeus.query(sql, [studentId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v))[0]);
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

// Path: /student/plans/<session_id>/<student_id (optional if student signed in)>
router.get('/plans/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];

        let sql = "SELECT id, name FROM plan WHERE user_id = ?";
        zeus.query(sql, [studentId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v)));
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

// Path: /student/courses/<session_id>/<student_id (optional if student signed in)>
router.get('/courses/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        
        let sql = "SELECT * FROM course";
        zeus.query(sql, [], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v)));
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

module.exports = router;
