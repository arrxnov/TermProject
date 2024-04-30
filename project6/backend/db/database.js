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

// async function initDb() {
//     var db = await mysql.createPool({
//         host: "163.11.237.170",
//         database: "zeus",
//         user: "lmiller",
//         password: "password",
//         waitForConnections: true,
//         connectionLimit: 10,
//         queueLimit: 0
//     });
    
//     // await db.connect(function(err) {
//     //     if (err) throw err;
//     //     console.log("Database Connected!");
//     // });

//     console.log("Database Connected!")

//     return db;
// }

module.exports = db;