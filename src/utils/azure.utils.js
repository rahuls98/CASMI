const azureClient = require("../clients/azure.client");
const { AZURE_CONFIG } = require("../../config");
const errorLogger = require("../helpers/error_logger");

const getStores = async () => {
    try {
        const containers = azureClient.listContainers();
        let stores = [];
        for await (const container of containers) {
            stores.push(container.name);
        }
        return stores;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ line 13 ~ getStores ~ err", err);
    }
};

const getFiles = async () => {
    try {
        const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
        let blobs = containerClient.listBlobsFlat();
        let files = [];
        for await (const blob of blobs) {
            files.push(blob.name);
        }
        return files;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ line 28 ~ getFiles ~ err", err);
    }
};

const uploadFile = async (fileName, filePath) => {
    try {
        const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadFile(filePath);
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ line 39 ~ uploadFile ~ err", err);
    }
};

module.exports = { getStores, getFiles, uploadFile };
