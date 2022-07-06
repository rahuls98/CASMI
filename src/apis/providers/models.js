const dbConnection = require("../../db");

const create = (providerData) => {
    const query = `
    INSERT INTO providers (code, public_name) 
    VALUES ('${providerData.providerCode}', '${providerData.providerPublicName}')
    ;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const read = () => {
    const query = `SELECT * FROM providers;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (providerId) => {
    const query = `SELECT * FROM providers WHERE id=${providerId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById };
