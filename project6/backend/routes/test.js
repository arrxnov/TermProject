var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"message": "test api"});
});

module.exports = router;
