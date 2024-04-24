var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.post('/plandata', function(req, res, next) {
    // make sure getting params is correct once Jacob has post data to send
    let validSession = auth.validatePlan(req.body.session_id, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let role = validSession["role"];
        let studentId = validSession["studentId"];
        let planId = validSession["planId"];
        
        // TODO: add query to update notes to the database plan table
        res.send("Plan data successfully saved");
    }
    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }

    next();
});

router.post('/plancourses', function(req, res, next) {
    // make sure getting params is correct once Jacob has post data to send
    let validSession = auth.validatePlan(req.body.session_id, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        let planId = validSession["planId"];
        
        // TODO: add query to update notes to the database plan table
        res.send("Plan courses successfully saved");
    }
    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }

    next();
});

module.exports = router;