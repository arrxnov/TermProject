var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"id": "CS-1220", "name": "Obj-Orient", "credits": 3.0, "description" : "You'll hate your life"});
});

module.exports = router;