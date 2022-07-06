const dbConnection = require("../../db");

const create = (data) => {
    const query = `INSERT INTO files (name, size, provider_key, folder_id, store_id, space_id, provider_id) 
    VALUES ('${data.name}', ${data.size}, '${data.providerKey}', ${data.folderId}, ${data.storeId}, ${data.spaceId}, ${data.provider_id});`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (fileId) => {
    const query = `SELECT * FROM files WHERE id=${fileId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readProviderCode = (fileId) => {
    const query = `SELECT providers.code AS provider_code FROM files INNER JOIN providers 
    ON files.provider_id=providers.id WHERE files.id=${fileId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, readById, readProviderCode };
