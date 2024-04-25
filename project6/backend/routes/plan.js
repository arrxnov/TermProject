var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/plandata/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        let plan_id = validSession["planId"];

        var majors = [];
        var minors = [];
        
        let sql = "SELECT major.name FROM plannedmajor INNER JOIN major ON plannedmajor.major_id=major.id WHERE plannedmajor.plan_id = ?";
        zeus.query(sql, [plan_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                console.error(error.message);
            }

            majors = results.map(v => Object.assign({}, v));
            majors = 19;
        });

        sql = "SELECT minor.name FROM plannedminor INNER JOIN minor ON plannedminor.minor_id=minor.id WHERE plannedminor.plan_id = ?";
        zeus.query(sql, [plan_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                console.error(error.message);
            }

            minors = results.map(v => Object.assign({}, v));
        });
        
        console.log(majors);
        console.log(minors);

        res.send({"majors": 1, "minors": 1});
        
        // // TODO: add query to get this from the database
        // res.send({"name": "CS-Default", "minors": ["Bible"], "majors": ["CS", "CY"], "catalog_year" : 2021});
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

router.get('/plancourses/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        let plan_id = validSession["planId"]; 
        
        // TODO: add query to get this from the database
        res.send([{"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"}]);
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

router.get('/planreqs/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        let plan_id = validSession["planId"]; 
        
        // TODO: add query to get this from the database
        res.send([{"course_id": "CS-1220", "type": "core"}]);
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
});

module.exports = router;