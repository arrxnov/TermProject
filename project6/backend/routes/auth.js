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

        console.log(results["PasswordHash"]);
        console.log(req.body.phash);

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
    req.send("Session terminated");
});

function validateFaculty(req) {
    if (req.session.authenticated && req.session.role == "Faculty") {
        return {"valid": true};
    }

    else {
        return {"valid": false};
    }
}


function validateStudent(sessionId, studentId=null) {
    let role = "";
    let userId = null; 
    
    let queryResult = getUserIdFromSession(sessionId);
    if (Object.keys(queryResult).length != 0 && queryResult["valid"]) {
        userId = queryResult["UserId"];
    } else {
        res.send(queryResult);
    }

    
    if (studentId) {
        // check that studentId belongs to the logged-in faculty's advisee list
        // aka check if advisorId and studentId match
        role = "faculty";
        sql = "SELECT * FROM advisee WHERE advisor_id = ? and advisee_id = ?";
        queryResult = null;
        zeus.query(sql, [userId, studentId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            queryResult = results.map(v => Object.assign({}, v));
        });
        if (Object.keys(queryResult).length == 0) {
            return {"valid": false};
        } 
    }
    else {
        // set studentId to correspond to the authenticated student
        role = "student";
        studentId = userId;
    }

    return {"valid": true, "role": role, "studentId": studentId};
}

function validatePlan(sessionId, planId, studentId=null) {
    queryResult = validateStudent(sessionId, studentId);
    if (!queryResult["valid"]) {
        return queryResult;
    } else {
        role = queryResult["role"];
        studentId = queryResult["studentId"];
    }

    // check that plan belongs to studentId
    sql = "SELECT * FROM plan WHERE user_id = ? and plan_id = ?";
    queryResult = null;
    zeus.query(sql, [studentId, planId], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }

        queryResult = results.map(v => Object.assign({}, v));
    });

    if (Object.keys(queryResult).length != 0) {
        return {"valid": true, "role": role, "planId": planId, "studentId": studentId};
    } else {
        return {"valid": false};
    }   
}


module.exports = router;
module.exports.validateFaculty = validateFaculty;
module.exports.validateStudent = validateStudent;
module.exports.validatePlan = validatePlan;