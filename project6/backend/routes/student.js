var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

    if (role) {
        // TODO: add query to get this from the database
        res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
    }
});

router.get('/plans/:session_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

    if (role) {
        // TODO: add query to get this from the database
        res.send({"id": 1, "name": "My Cool Plan"});
    }
});

router.get('/courses/:session_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

    if (role) {
        // TODO: add query to get this from the database
        res.send({"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"});
    }
});

module.exports = router;

async function validateSession(res, sessionId, studentId=null) {
    if (studentId) {
        var apiCall = "/auth/validate_student/" + sessionId + "/" + studentId;
    }
    else {
        var apiCall = "/auth/validate_student/" + sessionId;
    }

    let response = await fetch(apiCall);
    const validSession = await response.json();
 
    if (!validSession["valid"]) {
        res.status(400);
        res.send('Invalid credentials for requested resource');
        return "";
    }
    else {
        return validSession["role"];
    }
}
