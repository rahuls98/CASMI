const stream = require("stream");
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
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ getStores ~ err", err);
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
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ getFiles ~ err", err);
    }
};

const uploadFile = async (fileName, filePath) => {
    try {
        await gcpClient.bucket(GCP_CONFIG.BUCKET_NAME).upload(filePath, {
            destination: fileName,
        });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ uploadFile ~ err", err);
    }
};

const getPresignedUrl = async () => {
    const options = {
        version: "v4",
        action: "read",
        //expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        expires: Date.now() + 20 * 1000, // 20 seconds
    };

    const [url] = await gcpClient
        .bucket(GCP_CONFIG.BUCKET_NAME)
        .file(".gitignore")
        .getSignedUrl(options);

    console.log("Generated GET signed URL:");
    console.log(url);
};

const getDownloadStream = async () => {
    let filestream = await gcpClient
        .bucket(GCP_CONFIG.BUCKET_NAME)
        .file(".gitignore")
        .createReadStream();

    const dataStream = new stream.PassThrough();
    filestream.pipe(dataStream);
    return dataStream;
};

module.exports = { getStores, getFiles, uploadFile, getDownloadStream };
