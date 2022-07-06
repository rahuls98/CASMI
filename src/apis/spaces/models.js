const dbConnection = require("../../db");

const create = (spaceData) => {
    const query = `INSERT INTO spaces (name) VALUES ('${spaceData.name}');`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const read = () => {
    const query = `
    SELECT spaces.id AS id, spaces.name AS name, 
    GROUP_CONCAT(DISTINCT space_provider.provider_id SEPARATOR ',') AS provider_ids 
    FROM spaces INNER JOIN space_provider 
    ON spaces.id=space_provider.space_id 
    GROUP BY spaces.id;
    `;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const readById = (id) => {
    const query = `
    SELECT spaces.id AS id, spaces.name AS name, 
    GROUP_CONCAT(DISTINCT space_provider.provider_id SEPARATOR ',') AS provider_ids 
    FROM spaces INNER JOIN space_provider 
    ON spaces.id=space_provider.space_id 
    WHERE spaces.id=${id} 
    GROUP BY spaces.id;
    `;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

const associateProvider = async (spaceId, providerId) => {
    const query = `INSERT INTO space_provider (space_id, provider_id) VALUES (${spaceId}, ${providerId});`;
    return new Promise((resolve, reject) => {
        dbConnection.execute(query, (err, res) => {
            if (err) reject(err);
            resolve(res);
        });
    });
};

module.exports = { create, read, readById, associateProvider };
