const fs = require("fs");
const azureClient = require("../../utils/azure_client");
const { AZURE_CONFIG } = require("../../../config");

const getStores = async (req, res, next) => {
    const stores = azureClient.listContainers();
    let storeNames = [];
    for await (const store of stores) {
        storeNames.push(store.name);
    }
    res.send({ success: true, stores: storeNames });
};

const getFiles = async (req, res, next) => {
    const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
    let files = containerClient.listBlobsFlat();
    let fileNames = [];
    for await (const file of files) {
        fileNames.push(file.name);
    }
    res.send({ success: true, files: fileNames });
};

const postFile = async (req, res, next) => {
    const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(req.file.originalname);
    await blockBlobClient.uploadFile(req.file.path);
    res.send({ success: true });
};

module.exports = { getStores, getFiles, postFile };
