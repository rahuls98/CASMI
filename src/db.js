const mysql = require("mysql2");
const errorLogger = require("./helpers/error_logger");
const dotenv = require("dotenv");
dotenv.config();

let dbConnection;

try {
    dbConnection = mysql.createConnection({
        host: process.env.DATABASE_HOST,
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_DATABASE,
    });
    dbConnection.connect();
} catch (err) {
    errorLogger("DEBUG LOG ~ file: db.js ~ err", err);
}

module.exports = dbConnection;
