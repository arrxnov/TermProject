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

// router.get('/role', function(req, res, next) {
//     res.send(getRole(req));
// });

    // let queryResult = getUserIdFromSession(req.sessionID);
    // let userId = null;
    // let role = null;

    // if (Object.keys(queryResult).length == 0 || !queryResult["valid"]) {
    //     res.send(queryResult);
    // } else {
    //     userId = queryResult["UserId"];

    //     sql = "SELECT role FROM aspnetuserroles WHERE user_id = ?";
    //     queryResult = null;
    //     zeus.query(sql, [userId], (error, results) => {
    //         if (error) {
    //             console.log(sql + " failed");
    //             return console.error(error.message);
    //         }
    //         queryResult = results.map(v => Object.assign({}, v));
    //     });

    //     if (Object.keys(queryResult).length == 0) {
    //         res.status(400);
    //         res.send('User \'s roles are not properly configured\n');
    //         return;
    //     } 
    //     switch(queryResult["role"]) {
    //         case 1:
    //             role = "Admin";
    //         case 2:
    //             role = "Faculty";
    //         case 3:
    //             role = "Student";
    //         }
    //     if (role == null) {
    //         res.send('Invalid role number\n');
    //     } else {
    //         const validSession = {"valid": true, "role": role, "userId": userId};
    //         res.send(validSession);
    //     }        
    // }

// function getUserIdFromSession(sessionId) {
//     let sql = "SELECT UserId FROM aspnetusertokens WHERE Value = ?";
//     let queryResult = null;
//     zeus.query(sql, [sessionId], (error, results) => {
//         if (error) {
//             console.log(sql + " failed");
//             return console.error(error.message);
//         }

//         queryResult = results.map(v => Object.assign({}, v));
//     });

//     if (Object.keys(queryResult).length == 0) {
//         return {"valid": false};
//     } else {
//         userId = queryResult["UserId"];
//     } 

//     userId = queryResult['UserId'];
//     if (userId == null || userId.length == 0) {
//         return {"valid": false};
//     }
//     return {"valid": true, "userId": userId};
// }


function validateFaculty(req) {
    if (req.session.authenticated && req.session.role == "Faculty") {
        return {"valid": true};
    }

    else {
        return {"valid": false};
    }
    
    // let userId = null; 
    
    // let queryResult = getUserIdFromSession(sessionId);
    // if (Object.keys(queryResult).length != 0 && queryResult["valid"]) {
    //     userId = queryResult["UserId"];
    // } else {
    //     res.send(queryResult);
    // }

    // // check user has faculty role
    // sql = "SELECT * FROM aspnetuserroles WHERE user_id = ? and role = 2";
    // queryResult = null;
    // zeus.query(sql, [userId], (error, results) => {
    //     if (error) {
    //         console.log(sql + " failed");
    //         return console.error(error.message);
    //     }
    //     queryResult = results.map(v => Object.assign({}, v));
    // });

    // if (Object.keys(queryResult).length == 0) {
    //     return {"valid": false};
    // } else {
    //     return {"valid": true, "facultyId": userId};
    // }
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