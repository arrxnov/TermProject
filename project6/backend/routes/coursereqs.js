var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

/* GET course requirememts */
router.get('/', function(req, res, next) {
  res.send({"course_id": "CS-1220", "type": "core"});
});

module.exports = router;