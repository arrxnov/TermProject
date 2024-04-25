var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/login', function(req, res, next) {
    // add url parameters above

    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});

router.get('/logout', function(req, res, next) {
    // add session parameter above
    
    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});

router.get('/role', function(req, res, next) {
    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});

// let sql = "SELECT name, gpa, major_gpa, default_plan_id FROM user WHERE id = ?";
// zeus.query(sql, [studentId], (error, results) => {
//     if (error) {
//         console.log(sql + " failed");
//         return console.error(error.message);
//     }

//     res.send(results.map(v => Object.assign({}, v)));
// });

function validateFaculty(sessionId) {
    // check that a faculty member is currently signed in

    const validSession = {"valid": true, "facultyId": "683321ca-8c34-469e-9240-37a53252d93a"}; // FIXME make dynamic
    
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