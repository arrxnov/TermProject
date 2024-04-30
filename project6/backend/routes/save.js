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

        var [results, fields] = await (await zeus).execute(sql, [req.body.note, planId]);

        res.send("Plan note successfully saved\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

// POST request needs to have the following parameters: plan_id, student_id (optional if student is signed in), course_id, year, and term.
router.post('/updatecourse', async function(req, res, next) {
    let validSession = await auth.validatePlan(req.session, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let planId = validSession["planId"];
        
        let sql = "UPDATE plannedcourse SET year = ?, term = ? WHERE plan_id = ? AND course_id = ?";

        var [results, fields] = await (await zeus).execute(sql, [req.body.year, req.body.term, planId, req.body.course_id]);

        res.send("Course successfully updated\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

// POST request needs to have the following parameters: plan_id, student_id (optional if student is signed in), course_id, year, and term.
router.post('/addcourse', async function(req, res, next) {
    let validSession = await auth.validatePlan(req.session, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        let planId = validSession["planId"];
        
        let sql = "INSERT INTO plannedcourse VALUES (?, ?, ?, ?)";

        var [results, fields] = await (await zeus).execute(sql, [planId, req.body.course_id, req.body.year, req.body.term]);

        res.send("Course successfully added\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

module.exports = router;