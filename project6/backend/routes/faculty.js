var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/advisees', function(req, res, next) {
  res.send([{"id": "12345678", "name": "Jeve Stobs"}]);
});

module.exports = router;