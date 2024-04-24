var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/advisees', function(req, res, next) {
    let validSession = auth.validateStudent(req.params.session_id);

    if (validSession["valid"]) {
        let facultyId = validSession["facultyId"];
        
        // TODO: add query to get this from the database
        res.send([{"id": "12345678", "name": "Jeve Stobs"}]);
    }
    else {
        res.status(400);
        res.send('Invalid credentials for requested resource');
    }

    next();
});

module.exports = router;