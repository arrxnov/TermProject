var express = require('express');
var zeus = require('../db/database');
var auth = require('./auth');
var router = express.Router();

router.get('/advisees', function(req, res, next) {
    // TODO: add query to get this from the database
    res.send([{"id": "12345678", "name": "Jeve Stobs"}]);
});

module.exports = router;