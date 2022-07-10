const mysql = require("mysql2");
const { dbConfig } = require("../../db");

const create = (spaceData) => {
    const query = `INSERT INTO spaces (name, secret_id) 
    VALUES ('${spaceData.name}', ${spaceData.secretId});`;
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
    SELECT spaces.id AS id, spaces.name AS name, 
    GROUP_CONCAT(DISTINCT CONCAT('(',space_provider.provider_id,',',providers.public_name,')') SEPARATOR '|') AS providers
    FROM spaces INNER JOIN space_provider INNER JOIN providers
    ON spaces.id=space_provider.space_id AND space_provider.provider_id=providers.id
    GROUP BY spaces.id 
    ORDER BY spaces.id; 
    `;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (spaceId) => {
    const query = `
    SELECT spaces.id AS id, spaces.name AS name, 
    GROUP_CONCAT(DISTINCT CONCAT('(',space_provider.provider_id,',',providers.public_name,')') SEPARATOR '|') AS providers 
    FROM spaces INNER JOIN space_provider INNER JOIN providers
    ON spaces.id=space_provider.space_id AND space_provider.provider_id=providers.id 
    WHERE spaces.id=${spaceId}
    GROUP BY spaces.id 
    ORDER BY spaces.id; 
    `;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readByName = (spaceName) => {
    const query = `SELECT * FROM spaces WHERE name='${spaceName}';`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const associateProvider = (spaceId, providerId) => {
    const query = `INSERT INTO space_provider (space_id, provider_id) VALUES (${spaceId}, ${providerId});`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readNameVaultKey = (spaceId) => {
    const query = `
    SELECT spaces.id, spaces.name, secrets.vault_key 
    FROM spaces INNER JOIN secrets 
    ON spaces.secret_id=secrets.id 
    WHERE spaces.id=${spaceId}
    ;`;
    return new Promise((resolve, reject) => {
        const dbConnection = mysql.createConnection(dbConfig);
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById, readByName, associateProvider, readNameVaultKey };
