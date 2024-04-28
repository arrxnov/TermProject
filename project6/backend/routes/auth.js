var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/login/:uname/:phash', function(req, res, next) {
    /*
    aspnetusers
    - Id (hash)
    - UserName (string)
    - PasswordHash (hash)
    */
    let userId = null;
    sql = "SELECT Id FROM aspnetusers WHERE UserName = ? and PasswordHash = ?";
    queryResult = null;
    zeus.query(sql, [req.params.uname, req.params.phash], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }
        queryResult = results.map(v => Object.assign({}, v));
    });

    if (Object.keys(queryResult).length == 0) {
        res.status(400);
        res.send("Invalid login credentials\n");
    } else {
        userId = queryResult["Id"];
    }

    sql = "INSERT INTO aspnetusertokens (UserId, Name, Value) VALUES (?, ?, ?)";
    queryResult = null;
    zeus.query(sql, [userId, req.params.uname, req.sessionID], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }
        queryResult = results.map(v => Object.assign({}, v));
    });
    res.send({"valid": true, "id": userId, "sessionId": req.sessionID});
});

router.get('/logout', function(req, res, next) {
    // add session parameter above
    sql = "DELETE FROM aspnetusertokens WHERE Value = ? RETURNING UserId";
    queryResult = null;
    zeus.query(sql, [req.sessionID], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }
        queryResult = results.map(v => Object.assign({}, v));
    });
    if (Object.keys(queryResult).length == 0) {
        res.status(400);
        res.send("Logout failed\n");
    } else {
        res.send(queryResult["UserId"]);
    }
});

router.get('/role', function(req, res, next) {
    let queryResult = getUserIdFromSession(req.sessionID);
    let userId = null; 
    let role = null;

    if (Object.keys(queryResult).length == 0 || !queryResult["valid"]) {
        res.send(queryResult);
    } else {
        userId = queryResult["UserId"];

        sql = "SELECT role FROM aspnetuserroles WHERE user_id = ?";
        queryResult = null;
        zeus.query(sql, [userId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }
            queryResult = results.map(v => Object.assign({}, v));
        });

        if (Object.keys(queryResult).length == 0) {
            res.status(400);
            res.send('User \'s roles are not properly configured\n');
            return;
        } 
        switch(queryResult["role"]) {
            case 1:
                role = "Admin";
            case 2:
                role = "Faculty";
            case 3:
                role = "Student";
            }
        if (role == null) {
            res.send('Invalid role number\n');
        } else {
            const validSession = {"valid": true, "role": role, "userId": userId};
            res.send(validSession);
        }        
    }
});




function getUserIdFromSession(sessionId) {
    let sql = "SELECT UserId FROM aspnetusertokens WHERE Value = ?";
    let queryResult = null;
    zeus.query(sql, [sessionId], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }

        queryResult = results.map(v => Object.assign({}, v));
    });

    if (Object.keys(queryResult).length == 0) {
        return {"valid": false};
    } else {
        userId = queryResult["UserId"];
    } 

    userId = queryResult['UserId'];
    if (userId == null || userId.length == 0) {
        return {"valid": false};
    }
    return {"valid": true, "userId": userId};
}


function validateFaculty(sessionId) {
    let userId = null; 
    
    let queryResult = getUserIdFromSession(sessionId);
    if (Object.keys(queryResult).length != 0 && queryResult["valid"]) {
        userId = queryResult["UserId"];
    } else {
        res.send(queryResult);
    }

    // check user has faculty role
    sql = "SELECT * FROM aspnetuserroles WHERE user_id = ? and role = 2";
    queryResult = null;
    zeus.query(sql, [userId], (error, results) => {
        if (error) {
            console.log(sql + " failed");
            return console.error(error.message);
        }
        queryResult = results.map(v => Object.assign({}, v));
    });

    if (Object.keys(queryResult).length == 0) {
        return {"valid": false};
    } else {
        return {"valid": true, "facultyId": userId};
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