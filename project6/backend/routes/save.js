var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

// POST request needs to have the following parameters: plan_id, student_id (optional if student is signed in), and note.
router.post('/updatenote', async function(req, res, next) {
    let validSession = await auth.validatePlan(req.session, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let role = validSession["role"];
        let planId = validSession["planId"];

        var notes = "student_notes";
        if (role == "Faculty") {
            notes = "faculty_notes";
        }

        let sql = "UPDATE plan SET " + notes + " = ? WHERE id = ?";

        var [results, fields] = await zeus.execute(sql, [req.body.note, planId]);

        res.send("Plan note successfully saved\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

// POST request needs to have the following parameters: plan_id, student_id (optional if student is signed in), and courses: {course_id, year, term}.
router.post('/updatecourses', async function(req, res, next) {
    let validSession = await auth.validatePlan(req.session, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        var planId = validSession["planId"];
        
        var sql = "INSERT INTO plannedcourse VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE year = ?, term = ?";

        for (let course of req.body.courses) {
            let cid = course["course_id"];
            let year = course["year"];
            let term = course["term"];

            await zeus.execute(sql, [planId, cid, year, term, year, term]);
        }

        res.send("Plan courses successfully updated\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

module.exports = router;