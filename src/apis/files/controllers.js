const fileQueries = require("../files/queries");
const folderQueries = require("../folders/queries");
const spaceQueries = require("../spaces/queries");
const storeQueries = require("../stores/queries");
const providerUtils = require("../../providers");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");
const { singleFileUpload } = require("../../middlewares/multer.middleware");

const readFiles = async (req, res) => {
    try {
        const readFilesResponse = await fileQueries.read();
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
        const readFileResponse = await fileQueries.readById(req.params.id);
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
    const validateInput = async () => {
        if (!req.file) return [false, "File not provided!"];
        let requiredKeys = ["store_id", "destination"];
        let hasRequiredKeys = validators.hasKeys(req.body, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        const store_id = req.body.store_id;
        const readStoreByIdResponse = await storeQueries.readById(store_id);
        if (readStoreByIdResponse.length == 0) return [false, "No such store!"];
        const destination = req.body.destination;
        if (!Number(store_id) || !validators.isNonEmptyString(destination))
            return [false, "Invalid file data!"];
        if (
            destination.length > 1 &&
            (destination[0] != "/" || destination[destination.length - 1] == "/")
        )
            return [false, "Invalid destination path!"];
        return [true, ""];
    };
    singleFileUpload(req, res, async (err) => {
        if (err) {
            errorLogger("DEBUG LOG ~ file: controllers.js ~ uploadFile ~ err", err);
            const response = { success: false, message: err.message };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            try {
                const validateInputResponse = await validateInput();
                if (!validateInputResponse[0]) {
                    const response = { success: false, message: validateInputResponse[1] };
                    res.header("Content-Type", "application/json");
                    res.status(400).send(JSON.stringify(response, null, 4));
                } else {
                    const storeId = req.body.store_id;
                    const destinationFolder = req.body.destination;
                    // Add folder to DB if it doesn't exist
                    const readStoreResponse = await storeQueries.readById(storeId);
                    const readFolderResponse = await folderQueries.readByStoreProviderKey(
                        storeId,
                        destinationFolder
                    );
                    let folderCreateResponse, folderId;
                    if (readFolderResponse.length === 0) {
                        folderCreateResponse = await folderQueries.create({
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
                    const readProviderCodeResponse = await storeQueries.readProviderCode(storeId);
                    const providerCode = readProviderCodeResponse[0]["provider_code"];
                    const utils = providerUtils.getUtils(providerCode);
                    // Read name and vault key for space
                    const readSpaceResponse = await spaceQueries.readNameVaultKey(
                        readStoreResponse[0]["space_id"]
                    );
                    // Add file to DB
                    let destination;
                    if (destinationFolder == "/") {
                        destination = req.file.originalname;
                    } else {
                        destination = `${destinationFolder.slice(1)}/${req.file.originalname}`;
                    }
                    const fileCreateResponse = await fileQueries.create({
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
                    await storeQueries.updateFileCount(storeId);
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
        }
    });
};

const downloadFile = async (req, res) => {
    const validateInput = async () => {
        let requiredKeys = ["id"];
        let hasRequiredKeys = validators.hasKeys(req.params, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (!Number(req.params.id)) return [false, "ID not a number!"];
        const readFileResponse = await fileQueries.readById(req.params.id);
        if (readFileResponse.length == 0) return [false, "No such file!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = await validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const fileId = req.params.id;
        // Read provider code for store and load corresponding utils
        const readProviderCodeResponse = await fileQueries.readProviderCode(fileId);
        const providerCode = readProviderCodeResponse[0]["provider_code"];
        const utils = providerUtils.getUtils(providerCode);
        // Read space id, name and provider key
        const readSpaceProviderKeyResponse = await fileQueries.readSpaceProviderKey(fileId);
        // Read name and vault key for space
        const readSpaceResponse = await spaceQueries.readNameVaultKey(
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
