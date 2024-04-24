var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

// router.get('/plandata/:session_id/:student_id?', function(req, res, next) {
//     let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

//     if (role) {
//         res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
//     }
// });

// router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
//     let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

//     if (role) {
//         res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
//     }
// });

// router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
//     let role = validateSession(res, req.params.session_id, studentId=req.params.student_id);

//     if (role) {
//         res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
//     }
// });

// other routes: plandata, plancourses, coursereqs

// var express = require('express');
// var zeus = require('../db/database');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send({"name": "CS-Default", "minors": ["Bible"], "majors": ["CS", "CY"], "catalog_year" : 2021});
// });

// module.exports = router;

// var express = require('express');
// var zeus = require('../db/database');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send({"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"});
// });

// module.exports = router;

// var express = require('express');
// var zeus = require('../db/database');
// var router = express.Router();

// /* GET course requirememts */
// router.get('/', function(req, res, next) {
//   res.send({"course_id": "CS-1220", "type": "core"});
// });

// module.exports = router;

// var express = require('express');
// var zeus = require('../db/database');
// var router = express.Router();

// /* GET course requirememts */
// router.get('/', function(req, res, next) {
//   res.send({"course_id": "CS-1220", "type": "core"});
// });

// module.exports = router;

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
