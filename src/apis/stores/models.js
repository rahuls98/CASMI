const dbConnection = require("../../db");

const create = (storeData) => {
    const query = `
    INSERT INTO stores (file_count, space_id, provider_id)
    VALUES (0, ${storeData.space_id}, ${storeData.provider_id})
    ;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const read = () => {
    const query = `SELECT * FROM stores;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (storeId) => {
    const query = `SELECT * FROM stores WHERE id=${storeId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readProviderCode = (storeId) => {
    const query = `
    SELECT providers.code AS provider_code FROM stores INNER JOIN providers 
    ON stores.provider_id=providers.id WHERE stores.id=${storeId}
    ;`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const updateFileCount = (storeId) => {
    const query = `UPDATE stores SET file_count=file_count+1 WHERE id=${storeId};`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById, readProviderCode, updateFileCount };
