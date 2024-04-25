var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

// Path: /faculty/advisees
router.get('/advisees', function(req, res, next) {
    let validSession = auth.validateFaculty(req.params.session_id);

    if (validSession["valid"]) {
        let facultyId = validSession["facultyId"];

        let sql = "SELECT user.id, user.name " +
            "FROM user INNER JOIN advisee ON user.id=advisee.advisee_id " +
            "WHERE advisee.advisor_id = ?";
        zeus.query(sql, [facultyId], (error, results) => {
            if (error) {
                console.log(sql + " failed");
                return console.error(error.message);
            }

            res.send(results.map(v => Object.assign({}, v)));
        });
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource\n');
    }
});

module.exports = router;