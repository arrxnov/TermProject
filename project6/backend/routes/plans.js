var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send({"id": 1, "name": "My Cool Plan"});
});

module.exports = router;