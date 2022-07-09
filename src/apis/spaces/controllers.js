const dotenv = require("dotenv");
dotenv.config();
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");
const { vault, appRoleConfig } = require("../../vault");
const { getUtils } = require("../../providers");
const foldersModel = require("../folders/models");
const providersModel = require("../providers/models");
const spacesModel = require("./models");
const secretsModel = require("../secrets/models");
const storesModel = require("../stores/models");

const createSpace = async (req, res) => {
    const inputIsValid = async () => {
        let requiredKeys = ["name", "provider_ids", "default_secrets", "secrets"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (
            !hasRequiredKeys ||
            !validators.isNonEmptyString(req.body.name) ||
            !validators.isNonEmptyArray(req.body.provider_ids) ||
            !validators.isBoolean(req.body.default_secrets) ||
            !validators.isObject(req.body.secrets)
        )
            return false;
        const readCountResponse = await providersModel.readCountByIds(req.body.provider_ids);
        if (readCountResponse[0]["count"] !== req.body.provider_ids.length) return false;
        if (!req.body.default_secrets && !validators.isNonEmptyObject(req.body.secrets))
            return false;
        return true;
    };
    try {
        if (!(await inputIsValid())) {
            const response = { success: false, message: "Insufficient/Invalid space data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const spaceName = req.body.name;
            // Associate default secret
            const readSecretResponse = await secretsModel.readById(
                process.env.CASMI_DEFAULT_SECRETS_ID
            );
            let secretId = readSecretResponse[0]["id"];
            let secretVaultKey = readSecretResponse[0]["vault_key"];
            // Write and associate custom secrets if provided
            if (!req.body.default_secrets) {
                const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
                vault.token = vaultLoginResponse.auth.client_token;
                const vaultKey = `${process.env.CASMI_SECRETS_PREFIX}/${spaceName}`;
                await vault.write(vaultKey, { data: req.body.secrets });
                const createSecretResponse = await secretsModel.create({
                    name: spaceName,
                    vaultKey: vaultKey,
                });
                secretId = createSecretResponse["insertId"];
                secretVaultKey = vaultKey;
            }
            // Create space
            const createSpaceResponse = await spacesModel.create({
                name: spaceName,
                secretId: secretId,
            });
            const spaceId = createSpaceResponse["insertId"];
            // For each provider -> create association, store, and root folder
            let associateProviderResponse, utils, createStoreResponse, createFolderResponse;
            for (let providerId of req.body.provider_ids) {
                associateProviderResponse = await spacesModel.associateProvider(
                    spaceId,
                    providerId
                );
                const readProviderResponse = await providersModel.readById(providerId);
                utils = getUtils(readProviderResponse[0]["code"]);
                await utils.createStore(secretVaultKey, spaceName);
                createStoreResponse = await storesModel.create({
                    name: req.body.name,
                    space_id: spaceId,
                    provider_id: providerId,
                });
                createFolderResponse = await foldersModel.create({
                    providerKey: "/",
                    storeId: createStoreResponse["insertId"],
                    spaceId: spaceId,
                    providerId: providerId,
                });
            }
            const response = { success: true, space_id: spaceId };
            res.header("Content-Type", "application/json");
            res.status(201).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ createSpace ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readSpaces = async (req, res) => {
    try {
        const readSpacesResponse = await spacesModel.read();
        for (let space of readSpacesResponse) {
            space["providers"] = space["providers"].split("|");
        }
        const response = { success: true, spaces: readSpacesResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readSpaces ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readSpaceById = async (req, res) => {
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid space id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readSpaceResponse = await spacesModel.readById(req.params.id);
        if (readSpaceResponse.length == 0) {
            const response = { success: false, message: "No such space!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            readSpaceResponse[0]["providers"] = readSpaceResponse[0]["providers"].split("|");
            const response = { success: true, space: readSpaceResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readSpaceById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { createSpace, readSpaces, readSpaceById };
