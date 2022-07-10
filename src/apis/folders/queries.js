const mysql = require("mysql2");
const { dbConfig } = require("../../db");

const create = (folderData) => {
    const query = `INSERT INTO folders (provider_key, store_id, space_id, provider_id) 
    VALUES ('${folderData.providerKey}', ${folderData.storeId}, ${folderData.spaceId}, '${folderData.providerId}');`;
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
    const query = `
    SELECT folders.id, folders.provider_key, folders.store_id, folders.space_id, spaces.name AS space, folders.provider_id, providers.public_name AS provider 
    FROM folders INNER JOIN spaces INNER JOIN providers 
    ON folders.space_id=spaces.id AND folders.provider_id=providers.id
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

const readById = (folderId) => {
    const query = `
    SELECT folders.id, folders.provider_key, folders.store_id, folders.space_id, spaces.name AS space, folders.provider_id, providers.public_name AS provider 
    FROM folders INNER JOIN spaces INNER JOIN providers 
    ON folders.space_id=spaces.id AND folders.provider_id=providers.id 
    WHERE folders.id=${folderId};
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

const readByStoreProviderKey = (storeId, providerKey) => {
    const query = `SELECT * FROM folders WHERE store_id=${storeId} AND provider_key='${providerKey}';`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
        dbConnection.end();
    });
};

module.exports = { create, read, readById, readByStoreProviderKey };
