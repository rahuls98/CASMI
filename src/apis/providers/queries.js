const mysql = require("mysql2");
const { dbConfig } = require("../../db");

const create = (providerData) => {
    const query = `
    INSERT INTO providers (code, public_name) 
    VALUES ('${providerData.code}', '${providerData.publicName}')
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
        dbConnection.end();
    });
};

const read = () => {
    const query = `SELECT * FROM providers;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
        dbConnection.end();
    });
};

const readById = (providerId) => {
    const query = `SELECT * FROM providers WHERE id=${providerId};`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
        dbConnection.end();
    });
};

const readCountByIds = (providerIds) => {
    let stringifiedIds = providerIds.join(",");
    const query = `SELECT COUNT(*) AS count FROM providers WHERE id IN (${stringifiedIds});`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
        dbConnection.end();
    });
};

module.exports = { create, read, readById, readCountByIds };
