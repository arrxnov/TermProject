var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/advisees', async function(req, res, next) {
    let validSession = auth.validateFaculty(req.session);

    if (validSession["valid"]) {
        let facultyId = validSession["facultyId"];

        console.log(facultyId);

        let sql = "SELECT user.id, user.name " +
            "FROM user INNER JOIN advisee ON user.id=advisee.advisee_id " +
            "WHERE advisee.advisor_id = ?";

        var [results, fields] = await (await zeus).execute(sql, [facultyId]);

        res.send(results.map(v => Object.assign({}, v)));
    }

    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

module.exports = router;