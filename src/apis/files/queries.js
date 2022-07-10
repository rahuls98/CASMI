const mysql = require("mysql2");
const { dbConfig } = require("../../db");

const create = (data) => {
    const query = `
    INSERT INTO files (name, size, provider_key, folder_id, store_id, space_id, provider_id) 
    VALUES ('${data.name}', ${data.size}, '${data.providerKey}', ${data.folderId}, ${data.storeId}, ${data.spaceId}, ${data.provider_id})
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const read = () => {
    const query = `
    SELECT files.id, files.name, files.size, files.provider_key, files.folder_id, files.store_id, files.space_id, spaces.name AS space, files.provider_id, providers.public_name AS provider 
    FROM files INNER JOIN spaces INNER JOIN providers 
    ON files.space_id=spaces.id AND files.provider_id=providers.id
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (fileId) => {
    const query = `
    SELECT files.id, files.name, files.size, files.provider_key, files.folder_id, files.store_id, files.space_id, spaces.name AS space, files.provider_id, providers.public_name AS provider 
    FROM files INNER JOIN spaces INNER JOIN providers 
    ON files.space_id=spaces.id AND files.provider_id=providers.id 
    WHERE files.id=${fileId}
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readProviderCode = (fileId) => {
    const query = `
    SELECT providers.code AS provider_code FROM files INNER JOIN providers 
    ON files.provider_id=providers.id WHERE files.id=${fileId}
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readSpaceProviderKey = (fileId) => {
    const query = `
    SELECT files.id, files.name as file, files.space_id, files.provider_key 
    FROM files INNER JOIN spaces 
    ON files.space_id=spaces.id 
    WHERE files.id=${fileId}
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById, readProviderCode, readSpaceProviderKey };
