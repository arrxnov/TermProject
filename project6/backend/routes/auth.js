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

router.get('/logout', function(req, res, next) {
    req.session = null;
    res.send("Session terminated");
});


function validateFaculty(req) {
    if (req.session.authenticated && req.session.role == "Faculty") {
        return {"valid": true};
    } else {
        return {"valid": false};
    }
}


function validateStudent(req, studentId=null) {
    if (req.session.authenticated) {
        if (req.session.role == "Student") {
            return {"valid": true, "role": "student", "studentId": req.session.userId};
        } else {
            sql = "SELECT * FROM advisee WHERE advisor_id = ? and advisee_id = ?";
            zeus.query(sql, [req.session.userId, studentId], async (error, results) => {
                if (error) {
                    console.log(sql + " failed");
                    return console.error(error.message);
                }

                var id = results.map(v => Object.assign({}, v))[0]["advisee_id"];
                if (id != null) {
                    return {"valid": true, "role": "faculty", "facultyId": req.session.userId, "studentId": studentId};
                } else {
                    return {"valid": false};
                }

            });
        }
    } else {
        return {"valid": false};
    }
    return "I broke";
}

function validatePlan(req, planId, studentId=null) {
    queryResult = validateStudent(req, studentId);
    if (!queryResult["valid"]) {
        return queryResult;
    } else {
        role = queryResult["role"];
        studentId = queryResult["studentId"];
    }

    // check that plan belongs to studentId
    sql = "SELECT * FROM plan WHERE user_id = ? and id = ?";
    queryResult = null;
    zeus.query(sql, [studentId, planId], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }

        year = results.map(v => Object.assign({}, v))["catalog_year"];
        if (year != null) {
            return {"valid": true, "role": role, "planId": planId, "studentId": studentId};
        } else {
            return {"valid": false};
        }   
    });
}


module.exports = router;
module.exports.validateFaculty = validateFaculty;
module.exports.validateStudent = validateStudent;
module.exports.validatePlan = validatePlan;