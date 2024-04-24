var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/session/:session_id/:student_id?', function(req, res, next) {
  let validSession = validateSession(req.params.session_id, req.params.student_id);

  if (!validSession) {
    res.status(400);
    res.send('Invalid credentials for requested resource');
  }
  else {
    res.send({"name": "Logan Miller", "gpa": 3.00, "major_gpa": 3.05, "default_plan_id" : 1});
  }
});

module.exports = router;

async function validateSession(sessionId, studentId) {
  let response = await fetch("/authperms/session/" + sessionId + "/" + studentId);
  return await response.json();
}