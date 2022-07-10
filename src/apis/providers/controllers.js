const providerQueries = require("./queries");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const createProvider = async (req, res) => {
    const validateInput = () => {
        let requiredKeys = ["code", "public_name"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (
            !validators.isNonEmptyString(req.body.code) ||
            !validators.isNonEmptyString(req.body.code) ||
            !validators.isNonEmptyString(req.body.public_name)
        )
            return [false, "Invalid provider data!"];
        if (!validators.isCorrectLength(req.body.code, 3, 3))
            return [false, "Invalid provider code!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const providerData = { code: req.body.code, publicName: req.body.public_name };
            const createProviderResponse = await providerQueries.create(providerData);
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
        const readProvidersResponse = await providerQueries.read();
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
        const readProviderResponse = await providerQueries.readById(req.params.id);
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
