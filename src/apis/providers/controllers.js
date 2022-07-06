const providersModel = require("./models");
const errorLogger = require("../../helpers/error_logger");

const createProvider = async (req, res) => {
    try {
        if (!req.body.code || !req.body.public_name) {
            const response = { success: false, message: "Insufficient provider data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const providerData = { code: req.body.code, publicName: req.body.public_name };
            const createProviderResponse = await providersModel.create(providerData);
            const response = { success: true, provider_id: createProviderResponse["insertId"] };
            res.header("Content-Type", "application/json");
            res.status(201).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ createProvider ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readProviders = async (req, res) => {
    try {
        const readProvidersResponse = await providersModel.read();
        const response = { success: true, providers: readProvidersResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readProviders ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readProviderById = async (req, res) => {
    try {
        const readProviderResponse = await providersModel.readById(req.params.id);
        if (readProviderResponse.length == 0) {
            const response = { success: false, message: "No such provider!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const response = { success: true, provider: readProviderResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readProviderById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { createProvider, readProviders, readProviderById };
