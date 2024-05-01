var express = require('express');
var zeus = require('../db/database');
var { createHash } = require('crypto');
var router = express.Router();

router.post('/login', async function(req, res, next) {
    
    let sql = "SELECT * FROM aspnetusers WHERE UserName = ?";
    var [results, fields] = await zeus.execute(sql, [req.body.username]);

    results = results.map(v => Object.assign({}, v))[0];

    if (results && results["PasswordHash"] == createHash('sha256').update(req.body.password).digest('hex')) {
        req.session.userId = results["Id"];
        req.session.authenticated = true;
        
        sql = "SELECT Name FROM aspnetroles INNER JOIN aspnetuserroles ON aspnetroles.Id=aspnetuserroles.RoleId WHERE UserId = ?";
        [results, fields] = await zeus.execute(sql, [req.session.userId]);

        req.session.role = results.map(v => Object.assign({}, v))[0]["Name"];

        res.send({"authenticated": req.session.authenticated, "sessionId": req.session.id, "role": req.session.role});
    }

    else {
        res.send({"authenticated": false});
    }
});

router.get('/checklogin', function(req, res, next) {
    if (req.session.authenticated) {
        res.send({"authenticated": true, "role": req.session.role})
    }

    else {
        res.send({"authenticated": false, "role": ""});
    }
});

router.get('/logout', function(req, res, next) {
    req.session.authenticated = false;
    res.send("Session terminated");
});


function validateFaculty(session) {
    if (session.authenticated && session.role == "Faculty") {
        return {"valid": true, "facultyId": session.userId};
    }

    return {"valid": false};

    // return {"valid": true};
}


async function validateStudent(session, studentId=null) {
    if (session.authenticated) {
        if (session.role == "Student") {
            return {"valid": true, "role": "student", "studentId": session.userId};
        } 
        
        else {
            let sql = "SELECT advisor_id FROM advisee WHERE advisee_id = ?";
            var [results, fields] = await zeus.execute(sql, [studentId]);

            if (results.map(v => Object.assign({}, v))[0]["advisor_id"] == session.userId) {
                return {"valid": true, "role": "faculty", "facultyId": session.userId, "studentId": studentId};
            }

            else {
                return {"valid": false};
            }
        }

    } else {
        return {"valid": false};
    }

    // return {"valid": true, "role": "Student", "studentId": "d1eae408-2a14-4740-ba90-d2caedacee76"};
}

async function validatePlan(session, planId, studentId=null) {
    let queryResult = await validateStudent(session, studentId);
    if (!queryResult["valid"]) {
        return queryResult;
    }

    let role = queryResult["role"];
    studentId = queryResult["studentId"];

    let sql = "SELECT user_id FROM plan WHERE id = ?";
    var [results, fields] = await zeus.execute(sql, [planId]);

    console.log(results);

    if (results.map(v => Object.assign({}, v))[0]["user_id"] == studentId) {
        return {"valid": true, "role": role, "planId": planId, "studentId": studentId};
    }

    else {
        return {"valid": false};
    }

    // return {"valid": true, "role": "Student", "planId": 4, "studentId": "d1eae408-2a14-4740-ba90-d2caedacee76"};
}

module.exports = router;
module.exports.validateFaculty = validateFaculty;
module.exports.validateStudent = validateStudent;
module.exports.validatePlan = validatePlan;