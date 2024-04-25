var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/plandata/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let plan_id = validSession["planId"];
        
        let sql = "SELECT (SELECT name FROM plan WHERE id = ?) AS name," +
            "(SELECT GROUP_CONCAT(major.name) FROM plannedmajor INNER JOIN major ON plannedmajor.major_id=major.id WHERE plannedmajor.plan_id = ?) AS majors," +
            "(SELECT GROUP_CONCAT(minor.name) FROM plannedminor INNER JOIN minor ON plannedminor.minor_id=minor.id WHERE plannedminor.plan_id = ?) AS minors," +
            "(SELECT catalog_year FROM plan WHERE id = ?) AS catalog_year";
        zeus.query(sql, [plan_id, plan_id, plan_id, plan_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            results = results.map(v => Object.assign({}, v))[0];
            results.majors = results.majors.split(",");
            results.minors = results.minors.split(",");

            res.send(results);
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

router.get('/plancourses/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let plan_id = validSession["planId"];
        
        let sql = "SELECT plannedcourse.course_id, course.name, course.credits, plannedcourse.year, plannedcourse.term " + 
            "FROM plannedcourse INNER JOIN course ON plannedcourse.course_id=course.id " +
            "WHERE plannedcourse.plan_id = ?";
        zeus.query(sql, [plan_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v)));
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

router.get('/planreqs/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let plan_id = validSession["planId"];

        let sql = "SELECT course_id, name, credits, type " +
            "FROM course INNER JOIN " +
                "(SELECT majorcourse.course_id, majorcourse.type " +
                "FROM plannedmajor INNER JOIN majorcourse ON plannedmajor.major_id=majorcourse.major_id " +
                "WHERE plannedmajor.plan_id = ? " +
                "UNION " +
                "SELECT minorcourse.course_id, minorcourse.type " +
                "FROM plannedminor INNER JOIN minorcourse ON plannedminor.minor_id=minorcourse.minor_id " +
                "WHERE plannedminor.plan_id = ? " +
                "UNION " +
                "SELECT course_id, type " +
                "FROM gened" +
            ") AS reqs ON course.id=reqs.course_id";
        zeus.query(sql, [plan_id, plan_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v)));
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

module.exports = router;