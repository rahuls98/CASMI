const providersModel = require("./models");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const createProvider = async (req, res) => {
    const inputIsValid = () => {
        let requiredKeys = ["code", "public_name"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (
            !hasRequiredKeys ||
            !validators.isNonEmptyString(req.body.code) ||
            !validators.isCorrectLength(req.body.code, 3, 3) ||
            !validators.isNonEmptyString(req.body.public_name)
        )
            return false;
        return true;
    };
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Insufficient/Invalid provider data!" };
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
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid provider id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
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
