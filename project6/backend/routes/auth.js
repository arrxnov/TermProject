var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/validate_student/:session_id/:student_id?', function(req, res, next) {
    var sessionId = req.params.session_id;
    var studentId = req.params.student_id; // may be undef
    
    // This needs to be made dynamic

    res.send({"valid": true, "role": "student"});
});

router.get('/validate_student/:session_id/:plan_id/:student_id?', function(req, res, next) {
    var sessionId = req.params.session_id;
    var planId = req.params.plan_id;
    var studentId = req.params.student_id; // may be undef
    
    // This needs to be made dynamic

    res.send({"valid": true, "role": "student"});
});

module.exports = router;