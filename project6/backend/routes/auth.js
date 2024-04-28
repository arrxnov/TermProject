var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/login/:uname/:phash', function(req, res, next) {
    // add url parameters above

    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});

router.get('/logout/:sessionID', function(req, res, next) {
    // add session parameter above
    
    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});

router.get('/role/:', function(req, res, next) {
    // query db if necessary and res.send(json) or ok messsage
    res.send({"something": "else", "about": "me"});

    // if error, send appropriate error code and message
});


function validateFaculty(sessionId) {
    let queryResult = getUserIdFromSession(sessionId);
    let userId = null; 
    
    if (Object.keys(queryResult).length == 0) {
        return {"valid": false};
    } else {
        if (!queryResult["valid"]) {
            return queryResult;
        }
        userId = queryResult["UserId"];
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
    } 

    const validSession = {"valid": true, "facultyId": userId};
    
    return validSession;
}


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

function validateStudent(sessionId, studentId=null) {
    let queryResult = getUserIdFromSession(sessionId);
    let role = "";
    let userId = null; 

    if (Object.keys(queryResult).length == 0) {
        return {"valid": false};
    } else {
        if (!queryResult["valid"]) {
            return queryResult;
        }
        userId = queryResult["UserId"];
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

    const validSession = {"valid": true, "role": role, "studentId": studentId};
    
    return validSession;
}

function validatePlan(sessionId, planId, studentId=null) {
    queryResult = validateStudent(sessionId, studentId);
    if (queryResult["valid"]) {
        role = queryResult["role"];
        studentId = queryResult["studentId"];
    } else {
        return queryResult;
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