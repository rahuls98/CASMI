const mysql = require("mysql2");
const { db_config } = require("../config");
const errorLogger = require("./helpers/error_logger");

let dbConnection;

try {
    dbConnection = mysql.createConnection(db_config);
    dbConnection.connect();
} catch (err) {
    errorLogger("DEBUG LOG ~ file: db.js ~ err", err);
}

module.exports = dbConnection;
