var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
});

module.exports = router;