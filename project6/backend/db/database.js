var mysql = require('mysql');
var md5 = require('md5');

var db = mysql.createConnection({
    host: "163.11.237.170",
    database: "zeus",
    user: "lmiller",
    password: "password"
});

db.connect(function(err) {
    if (err) throw err;
    console.log("Database Connected!");
});

module.exports = db;