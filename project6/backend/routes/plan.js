var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/plandata/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let validSession = auth.validatePlan(req.params.session_id, req.params.plan_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        let plan_id = validSession["planId"]; 
        
        // TODO: add query to get this from the database
        res.send({"name": "CS-Default", "minors": ["Bible"], "majors": ["CS", "CY"], "catalog_year" : 2021});
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }

    next();
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

    next();
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

    next();
});

module.exports = router;