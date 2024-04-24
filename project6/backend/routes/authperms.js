var express = require('express');
var zeus = require('../db/database');
var router = express.Router();

router.get('/session/:session_id/:student_id?/:plan_id?', function(req, res, next) {
    var sessionId = req.params.session_id;
    var studentId = req.params.student_id; // may be undef
    var planId = req.params.plan_id;       // may be undef
    
    // Kai needs to make this dynamic

    res.send({"valid": true, "role": "faculty"});
});

module.exports = router;