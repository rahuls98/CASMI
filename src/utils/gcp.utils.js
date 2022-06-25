const gcpClient = require("../clients/gcp.client");
const { GCP_CONFIG } = require("../../config");
const errorLogger = require("../helpers/error_logger");

const getStores = async () => {
    try {
        const [buckets] = await gcpClient.getBuckets();
        let stores = [];
        for (let store of buckets) {
            stores.push(store.name);
        }
        return stores;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ line 13 ~ getStores ~ err", err);
    }
};

const getFiles = async () => {
    try {
        const [files] = await gcpClient.bucket(GCP_CONFIG.BUCKET_NAME).getFiles();
        let fileNames = [];
        for (let file of files) {
            fileNames.push(file.name);
        }
        return fileNames;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ line 26 ~ getFiles ~ err", err);
    }
};

const uploadFile = async (fileName, filePath) => {
    try {
        await gcpClient.bucket(GCP_CONFIG.BUCKET_NAME).upload(filePath, {
            destination: fileName,
        });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ line 36 ~ uploadFile ~ err", err);
    }
};

module.exports = { getStores, getFiles, uploadFile };
