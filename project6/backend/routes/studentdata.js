var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

// call Kai's api and pass session id, user id, plan -d (default user and plan ids)
// have him return valid or not

// if not Kai's api
//     abort

router.get('/', function(req, res, next) {
  res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
});
module.exports = router;s