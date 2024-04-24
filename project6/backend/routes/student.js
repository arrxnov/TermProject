var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        let role = validSession["role"];
        let studentId = validSession["studentId"];
        
        // TODO: add query to get this from the database
        res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }

    next();
});

router.get('/plans/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        
        // TODO: add query to get this from the database
        res.send([{"id": 1, "name": "My Cool Plan"}]);
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
    
    next();
});

router.get('/courses/:session_id/:student_id?', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];
        
        // TODO: add query to get this from the database
        res.send([{"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"}]);
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }

    next();
});

module.exports = router;
