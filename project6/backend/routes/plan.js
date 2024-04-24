var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/plandata/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, req.params.plan_id, studentId=req.params.student_id);

    if (role) {
        res.send({"name": "CS-Default", "minors": ["Bible"], "majors": ["CS", "CY"], "catalog_year" : 2021});
    }
});

router.get('/plancourses/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, req.params.plan_id, studentId=req.params.student_id);

    if (role) {
        res.send({"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"});
    }
});

router.get('/planreqs/:session_id/:plan_id/:student_id?', function(req, res, next) {
    let role = validateSession(res, req.params.session_id, req.params.plan_id, studentId=req.params.student_id);

    if (role) {
        res.send({"course_id": "CS-1220", "type": "core"});
    }
});

module.exports = router;

async function validateSession(res, sessionId, planId, studentId=null) {
    if (studentId) {
        var apiCall = "/auth/validate_plan/" + sessionId + "/" + planId + "/" + studentId;
    }
    else {
        var apiCall = "/auth/validate_plan/" + sessionId + "/" + planId;
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
