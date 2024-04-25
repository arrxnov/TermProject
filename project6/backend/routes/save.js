var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

// PATH: /save/plandata
// POST request needs to have the following parameters: session_id, plan_id, student_id (optional if student is signed in), and note.
router.post('/plandata', function(req, res, next) {
    let validSession = auth.validatePlan(req.body.session_id, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let role = validSession["role"];
        let planId = validSession["planId"];

        var notes = "student_notes";
        if (role == "faculty") {
            notes = "faculty_notes";
        }

        let sql = "UPDATE plan " +
            "SET " + notes + " = ? " + 
            "WHERE id = ?";
        zeus.query(sql, [req.body.note, planId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send("Plan note successfully saved\n");
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

// PATH: /save/plancourses
// POST request needs to have the following parameters: session_id, plan_id, student_id (optional if student is signed in), course_id, year, and term.
router.post('/plancourses', function(req, res, next) {
    let validSession = auth.validatePlan(req.body.session_id, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let planId = validSession["planId"];
        
        let sql = "UPDATE plannedcourse " +
            "SET year = ?, term = ? " + 
            "WHERE plan_id = ? AND course_id = ?";
        zeus.query(sql, [req.body.year, req.body.term, planId, req.body.course_id], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send("Planned course successfully saved\n");
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

module.exports = router;