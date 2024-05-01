var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

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

        await zeus.execute(sql, [req.body.note, planId]);

        res.send("Plan note successfully saved\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

router.post('/updatecourses', async function(req, res, next) {
    let validSession = await auth.validatePlan(req.session, req.body.plan_id, req.body.student_id);

    if (validSession["valid"]) {
        var planId = validSession["planId"];
        
        var drop = "DELETE FROM plannedcourse WHERE plan_id = ?";
        var update = "INSERT INTO plannedcourse VALUES (?, ?, ?, ?)";

        await zeus.execute(drop, [planId]);

        for (let course of req.body.courses) {
            await zeus.execute(update, [planId, course["course_id"], course["year"], course["term"]]);
        }

        res.send("Plan courses successfully updated\n");
    }

    else {
        res.status(400);
        res.send('Invalid credentials for post request');
    }
});

module.exports = router;