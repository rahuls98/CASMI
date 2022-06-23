const fs = require("fs");
const gcpClient = require("../../utils/gcp_client");
const { GCP_CONFIG } = require("../../../config");

const getStores = async (req, res, next) => {
    const [stores] = await gcpClient.getBuckets();
    let storeNames = [];
    for (let store of stores) {
        storeNames.push(store.name);
    }
    res.send({ success: true, stores: storeNames });
};

const getFiles = async (req, res, next) => {
    const [files] = await gcpClient.bucket(GCP_CONFIG.BUCKET_NAME).getFiles();
    let fileNames = [];
    for (let file of files) {
        fileNames.push(file.name);
    }
    res.send({ success: true, files: fileNames });
};

const postFile = async (req, res, next) => {
    await gcpClient.bucket(GCP_CONFIG.BUCKET_NAME).upload(req.file.path, {
        destination: req.file.originalname,
    });
    res.send({ success: true });
};

module.exports = { getStores, getFiles, postFile };
