const filesModel = require("../files/models");
const foldersModel = require("../folders/models");
const providerUtils = require("../../providers");
const spacesModel = require("../spaces/models");
const storesModel = require("../stores/models");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const readFiles = async (req, res) => {
    try {
        const readFilesResponse = await filesModel.read();
        const response = { success: true, files: readFilesResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readFiles ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readFileById = async (req, res) => {
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid provider id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readFileResponse = await filesModel.readById(req.params.id);
        if (readFileResponse.length == 0) {
            const response = { success: false, message: "No such file!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const response = { success: true, file: readFileResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readFileById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const uploadFile = async (req, res) => {
    const inputIsValid = () => {
        let requiredKeys = ["store_id", "destination"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (
            !hasRequiredKeys ||
            !Number(req.body.store_id) ||
            !validators.isNonEmptyString(req.body.destination)
        )
            return false;
        if (
            req.body.destination[0] != "/" ||
            req.body.destination[req.body.destination.length - 1] == "/"
        )
            return false;
        return true;
    };
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Insufficient/Invalid file data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const storeId = req.body.store_id;
            const destinationFolder = req.body.destination;
            // Add folder to DB if it doesn't exist
            const readStoreResponse = await storesModel.readById(storeId);
            const readFolderResponse = await foldersModel.readByStoreProviderKey(
                storeId,
                destinationFolder
            );
            let folderCreateResponse, folderId;
            if (readFolderResponse.length === 0) {
                folderCreateResponse = await foldersModel.create({
                    providerKey: destinationFolder,
                    storeId: storeId,
                    spaceId: readStoreResponse[0]["space_id"],
                    providerId: readStoreResponse[0]["provider_id"],
                });
                folderId = folderCreateResponse["insertId"];
            } else {
                folderId = readFolderResponse[0]["id"];
            }
            // Read provider code for store and load corresponding utils
            const readProviderCodeResponse = await storesModel.readProviderCode(storeId);
            const providerCode = readProviderCodeResponse[0]["provider_code"];
            const utils = providerUtils.getUtils(providerCode);
            // Read name and vault key for space
            const readSpaceResponse = await spacesModel.readNameVaultKey(
                readStoreResponse[0]["space_id"]
            );
            // Add file to DB
            const destination = `${destinationFolder.slice(1)}/${req.file.originalname}`;
            const fileCreateResponse = await filesModel.create({
                name: req.file.originalname,
                size: req.file.size,
                providerKey: destination,
                folderId: folderId,
                storeId: storeId,
                spaceId: readStoreResponse[0]["space_id"],
                provider_id: readStoreResponse[0]["provider_id"],
            });
            // Upload file
            await utils.putFile(
                readSpaceResponse[0]["vault_key"],
                readSpaceResponse[0]["name"],
                destination,
                req.file.path
            );
            // Update store file count
            await storesModel.updateFileCount(storeId);
            const response = { success: true, file_id: fileCreateResponse["insertId"] };
            res.header("Content-Type", "application/json");
            res.status(201).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ uploadFile ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const downloadFile = async (req, res) => {
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid file id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const fileId = req.params.id;
        // Read provider code for store and load corresponding utils
        const readProviderCodeResponse = await filesModel.readProviderCode(fileId);
        const providerCode = readProviderCodeResponse[0]["provider_code"];
        const utils = providerUtils.getUtils(providerCode);
        // Read space id, name and provider key
        const readSpaceProviderKeyResponse = await filesModel.readSpaceProviderKey(fileId);
        // Read name and vault key for space
        const readSpaceResponse = await spacesModel.readNameVaultKey(
            readSpaceProviderKeyResponse[0]["space_id"]
        );
        if (req.accessClaim === "user") {
            let downloadStream = await utils.getDownloadStream(
                readSpaceResponse[0]["vault_key"],
                readSpaceResponse[0]["name"],
                readSpaceProviderKeyResponse[0]["provider_key"]
            );
            res.attachment(readSpaceProviderKeyResponse[0]["file"]);
            downloadStream.pipe(res);
        } else if (req.accessClaim === "guest") {
            const preSignedUrl = await utils.getSignedUrl(
                readSpaceResponse[0]["vault_key"],
                readSpaceResponse[0]["name"],
                readSpaceProviderKeyResponse[0]["provider_key"]
            );
            const response = { success: true, download_link: preSignedUrl };
            res.header("Content-Type", "application/json");
            res.status(201).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ downloadFile ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { readFiles, readFileById, uploadFile, downloadFile };
