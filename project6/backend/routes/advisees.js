var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET course requirememts */
router.get('/', function(req, res, next) {
  res.send({"id": "12345678", "name": "Jeve Stobs"});
});

module.exports = router;