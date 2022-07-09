const storesModel = require("./models");
const errorLogger = require("../../helpers/error_logger");

const readStores = async (req, res) => {
    try {
        const readStoresResponse = await storesModel.read();
        const response = { success: true, stores: readStoresResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ getStores ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readStoreById = async (req, res) => {
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid store id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readStoreResponse = await storesModel.readById(req.params.id);
        if (readStoreResponse.length == 0) {
            const response = { success: false, message: "No such store!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const response = { success: true, store: readStoreResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readStoreById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { readStores, readStoreById };
