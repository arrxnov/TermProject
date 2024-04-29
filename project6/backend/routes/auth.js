var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.post('/login', function(req, res, next) {
    let sql = "SELECT * FROM aspnetusers WHERE UserName = ?";
    zeus.query(sql, [req.body.username], async (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }

        results = results.map(v => Object.assign({}, v))[0];

        if (results && results["PasswordHash"] == req.body.phash) {
            req.session.userId = results["Id"];
            req.session.authenticated = true;
            
            sql = "SELECT Name FROM aspnetroles INNER JOIN aspnetuserroles ON aspnetroles.Id=aspnetuserroles.RoleId WHERE UserId = ?";
            zeus.query(sql, [req.session.userId], async (error, results) => {
                if (error) {
                    console.log(sql + " failed");
                    return console.error(error.message);
                }

                req.session.role = results.map(v => Object.assign({}, v))[0]["Name"];

                res.send({"authenticated": req.session.authenticated, "sessionId": req.session.id, "role": req.session.role});
            });
        }

        else {
            res.send({"valid": false});
        }
    });
});

router.get('/checklogin', function(req, res, next) {
    res.send({"valid": req.session.authenticated});
});

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.send("Session terminated");
});


function validateFaculty(session) {
    return {"valid": session.authenticated && session.role == "Faculty"};
}


function validateStudent(session, studentId=null) {
    if (session.authenticated) {
        if (session.role == "Student") {
            return {"valid": true, "role": "student", "studentId": session.userId};
        } 
        
        else {
            let sql = "SELECT advisor_id FROM advisee WHERE advisee_id = ?";
            zeus.query(sql, [studentId], async (error, results) => {
                if (error) {
                    console.log(sql + " failed");
                    return console.error(error.message);
                }

                if (results.map(v => Object.assign({}, v))[0]["advisor_id"] == session.userId) {
                    return {"valid": true, "role": "faculty", "facultyId": session.userId, "studentId": studentId};
                }

                else {
                    return {"valid": false};
                }

            });
        }

    } else {
        return {"valid": false};
    }
}

function validatePlan(session, planId, studentId=null) {
    let queryResult = validateStudent(session, studentId);
    if (!queryResult["valid"]) {
        return queryResult;
    }

    let role = queryResult["role"];
    studentId = queryResult["studentId"];

    let sql = "SELECT user_id FROM plan WHERE id = ?";
    zeus.query(sql, [planId], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }

        if (results.map(v => Object.assign({}, v))[0]["user_id"] == studentId) {
            return {"valid": true, "role": role, "planId": planId, "studentId": studentId};
        }
        
        else {
            return {"valid": false};
        }   
    });
}


module.exports = router;
module.exports.validateFaculty = validateFaculty;
module.exports.validateStudent = validateStudent;
module.exports.validatePlan = validatePlan;