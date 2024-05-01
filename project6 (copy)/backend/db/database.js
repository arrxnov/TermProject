var mysql = require('mysql2/promise');

var db = mysql.createPool({
    host: "163.11.237.170",
    database: "zeus",
    user: "lmiller",
    password: "password",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Database Connected!");

module.exports = db;