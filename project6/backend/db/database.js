var mysql = require('mysql2/promise');

async function initDb() {
    var db = await mysql.createConnection({
        host: "163.11.237.170",
        database: "zeus",
        user: "lmiller",
        password: "password"
    });
    
    // await db.connect(function(err) {
    //     if (err) throw err;
    //     console.log("Database Connected!");
    // });

    console.log("Database Connected!")

    return db;
}

module.exports = initDb();