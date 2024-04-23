var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"name": "CS-Default", "minors": ["Bible"], "majors": ["CS", "CY"], "catalog_year" : 2021});
});

module.exports = router;