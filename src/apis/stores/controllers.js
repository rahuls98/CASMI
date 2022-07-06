const models = require("./models");
const errorLogger = require("../../helpers/error_logger");

const readStores = async (req, res) => {
    try {
        const readResponse = await models.read();
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(readResponse, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ line 9 ~ getStores ~ err", err);
    }
};

const readStoreById = async (req, res) => {
    try {
        const storeId = req.params.store_id;
        const readResponse = await models.readById(storeId);
        res.header("Content-Type", "application/json");
        res.send(JSON.stringify(readResponse, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readStoreById ~ err", err);
    }
};

module.exports = { readStores, readStoreById };
