var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/studentdata/:session_id/:student_id?', function(req, res, next) {
    let validSession = validateSession(req.params.session_id, studentId=req.params.student_id);

    if (!validSession) {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }
    else {
        res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
    }
});

// other routes: studentdata, plans, courses, plandata, plancourses, coursereqs
// var express = require('express');
// var zeus = require('../db/database');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send({"id": 1, "name": "My Cool Plan"});
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

async function validateSession(sessionId, studentId=null, planId=null) {
    if (studentId && planId) {
        var apiCall = "/auth/validate/" + sessionId + "/" + studentId + "/" + planId;
    }
    else if (studentId) {
        var apiCall = "/auth/validate/" + sessionId + "/" + studentId;
    }
    else {
        var apiCall = "/auth/validate/" + sessionId;
    }

    let response = await fetch(apiCall);
    return await response.json();
}