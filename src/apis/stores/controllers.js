const storeQueries = require("./queries");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const readStores = async (req, res) => {
    try {
        const readStoresResponse = await storeQueries.read();
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
    const validateInput = () => {
        let requiredKeys = ["id"];
        let hasRequiredKeys = validators.hasKeys(req.params, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (!Number(req.params.id)) return [false, "ID not a number!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readStoreResponse = await storeQueries.readById(req.params.id);
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
