const dbConnection = require("../../db");

const create = (secretData) => {
    const query = `INSERT INTO secrets (name, vault_key) 
    VALUES ('${secretData.name}', '${secretData.vaultKey}');`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (secretId) => {
    const query = `SELECT * FROM secrets WHERE id=${secretId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, readById };
