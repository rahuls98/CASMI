const dbConnection = require("../../db");

const create = (folderData) => {
    const query = `INSERT INTO folders (provider_key, store_id, space_id, provider_id) 
    VALUES ('${folderData.providerKey}', ${folderData.storeId}, ${folderData.spaceId}, '${folderData.providerId}');`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const read = () => {
    const query = `
    SELECT folders.id, folders.provider_key, folders.store_id, folders.space_id, spaces.name AS space, folders.provider_id, providers.public_name AS provider 
    FROM folders INNER JOIN spaces INNER JOIN providers 
    ON folders.space_id=spaces.id AND folders.provider_id=providers.id
    ;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
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
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readByProviderKey = (providerKey) => {
    const query = `SELECT * FROM folders WHERE provider_key='${providerKey}';`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById, readByProviderKey };
