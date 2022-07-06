const dbConnection = require("../../db");

const create = (data) => {
    const query = `INSERT INTO folders (provider_key, store_id, space_id, provider_id) 
    VALUES ('${data.providerKey}', ${data.storeId}, ${data.spaceId}, '${data.providerId}');`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readByProviderKey = (providerKey) => {
    const query = `
    SELECT * FROM folders 
    WHERE provider_key='${providerKey}' 
    ;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, readByProviderKey };
