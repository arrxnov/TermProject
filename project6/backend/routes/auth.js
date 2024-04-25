var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send({"something": "else", "about": "me"});
    next();
});

// router.get('/validate_student/:session_id/:student_id?', function(req, res, next) {
//     var sessionId = req.params.session_id;
//     var studentId = req.params.student_id; // may be undef
    
//     // This needs to be made dynamic

//     res.send({"valid": true, "role": "student"});
//     next();
// });

// router.get('/validate_plan/:session_id/:plan_id/:student_id?', function(req, res, next) {
//     var sessionId = req.params.session_id;
//     var planId = req.params.plan_id;
//     var studentId = req.params.student_id; // may be undef
    
//     // This needs to be made dynamic

//     res.send({"valid": true, "role": "student"});
//     next();
// });

// I decided that these particular apis would be better done as function exports than url apis

function validateFaculty(sessionId) {
    // check that a faculty member is currently signed in

    const validSession = {"valid": true, "facultyId": 1}; // FIXME make dynamic
    
    return validSession;
}

function validateStudent(sessionId, studentId=null) {
    if (studentId) {
        // check that studentId belongs to the logged-in faculty's advisee list
    }
    else {
        // set studentId to correspond to the authenticated student
    }

    const validSession = {"valid": true, "role": "student", "studentId": "d1eae408-2a14-4740-ba90-d2caedacee76"}; // FIXME make dynamic
    
    return validSession;
}

function validatePlan(sessionId, planId, studentId=null) {
    if (studentId) {
        // check that studentId belongs to the logged-in faculty's advisee list
    }
    else {
        // set studentId to correspond to the authenticated student
    }

    // check that plan belongs to studentId

    const validSession = {"valid": true, "role": "faculty", "planId": 1, "studentId": "d1eae408-2a14-4740-ba90-d2caedacee76"}; // FIXME make dynamic
    
    return validSession;
}

module.exports = router;
module.exports.validateFaculty = validateFaculty;
module.exports.validateStudent = validateStudent;
module.exports.validatePlan = validatePlan;