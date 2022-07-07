const filesModel = require("../files/models");
const foldersModel = require("../folders/models");
const storesModel = require("../stores/models");
const providerUtils = require("../../providers");
const errorLogger = require("../../helpers/error_logger");

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
    try {
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
    try {
        let folderCreateResponse, folderId;
        const storeId = req.body.store_id;
        const source = req.file.path;
        const destinationFolder = req.body.destination;
        const destination = destinationFolder.slice(1) + req.file.originalname;
        const readProviderCodeResponse = await storesModel.readProviderCode(storeId);
        const providerCode = readProviderCodeResponse[0]["provider_code"];
        const utils = providerUtils.getUtils(providerCode);
        await utils.uploadFile(destination, source);
        const readFolderResponse = await foldersModel.readByProviderKey(destinationFolder);
        const readStoreResponse = await storesModel.readById(storeId);
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
        await filesModel.create({
            name: req.file.originalname,
            size: req.file.size,
            providerKey: destination,
            folderId: folderId,
            storeId: storeId,
            spaceId: readStoreResponse[0]["space_id"],
            provider_id: readStoreResponse[0]["provider_id"],
        });
        await storesModel.updateFileCount(storeId);
        res.send({ success: true });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ uploadFile ~ err", err);
    }
};

const downloadFile = async (req, res) => {
    try {
        const fileId = req.params.id;
        const readProviderCodeResponse = await filesModel.readProviderCode(fileId);
        const providerCode = readProviderCodeResponse[0]["provider_code"];
        const utils = providerUtils.getUtils(providerCode);
        const readFileResponse = await filesModel.readById(fileId);
        const providerKey = readFileResponse[0]["provider_key"];
        if (req.accessClaim === "user") {
            let downloadStream = await utils.getDownloadStream(providerKey);
            res.attachment(readFileResponse[0]["name"]);
            downloadStream.pipe(res);
        } else if (req.accessClaim === "guest") {
            const preSignedUrl = utils.getPresignedUrl(providerKey);
            res.send({
                success: true,
                download_link: preSignedUrl,
            });
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ downloadFile ~ err", err);
    }
};

module.exports = { readFiles, readFileById, uploadFile, downloadFile };
