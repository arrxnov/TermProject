var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/studentdata/:student_id?', async function(req, res, next) {
    let validSession = await auth.validateStudent(req.session, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];

        let sql = "SELECT name, gpa, major_gpa, default_plan_id FROM user WHERE id = ?";

        var [results, fields] = await zeus.execute(sql, [studentId]);

        res.send(results.map(v => Object.assign({}, v))[0]);
    }

    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

router.get('/plans/:student_id?', async function(req, res, next) {
    let validSession = await auth.validateStudent(req.session, req.params.student_id);

    if (validSession["valid"]) {
        let studentId = validSession["studentId"];

        let sql = "SELECT id, name FROM plan WHERE user_id = ?";

        var [results, fields] = await zeus.execute(sql, [studentId]);

        res.send(results.map(v => Object.assign({}, v)));
    }

    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

router.get('/courses/:student_id?', async function(req, res, next) {
    let validSession = await auth.validateStudent(req.session, req.params.student_id);

    if (validSession["valid"]) {
        
        let sql = "SELECT * FROM course";
        var [results, fields] = await zeus.execute(sql, []);

        res.send(results.map(v => Object.assign({}, v)));
    }
    
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

module.exports = router;
