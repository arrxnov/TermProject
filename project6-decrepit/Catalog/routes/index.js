var express = require('express');
var db = require('../db/database.js');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var catalogList = [];

  var sql = "SELECT * from catalog";
  db.query(sql, (err, rows) => {

    if (err) {
      console.log("SELECT from catalog failed");
      console.log(err);
      return;
    }
    // Render index.pug page using array
    res.render('index', {catalogs: rows});
  });
});

// won't work until it gets a login.pug view
router.get('/login', function(req, res, next) {
  res.render('login', { title : "Login", error : ""})
});

module.exports = router;
