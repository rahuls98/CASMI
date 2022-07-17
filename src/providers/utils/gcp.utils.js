const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const errorLogger = require("../../helpers/error_logger");
const { vault, appRoleConfig } = require("../../vault");
const dotenv = require("dotenv");
dotenv.config();

const getStorageClient = (config) => {
    return new Storage({
        credentials: config["SERVICE_ACCOUNT_CREDENTIALS"],
        projectId: config["PROJECT_ID"],
    });
};

const createStore = async (vaultKey, storeName) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.GCP);

        const [bucket] = await storageClient.createBucket(storeName, {
            location: "asia-south1",
            storageClass: "Standard",
        });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ createStore ~ err", err);
    }
};

const getDownloadStream = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.GCP);

        let filestream = await storageClient.bucket(storeName).file(sourceKey).createReadStream();
        const dataStream = new stream.PassThrough();
        filestream.pipe(dataStream);
        return dataStream;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ getDownloadStream ~ err", err);
    }
};

const getSignedUrl = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.GCP);

        const options = {
            version: "v4",
            action: "read",
            expires: Date.now() + process.env.SIGNED_URL_EXPIRY_SECONDS * 1000, // 20 seconds
        };
        const [url] = await storageClient.bucket(storeName).file(sourceKey).getSignedUrl(options);
        return url;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ getSignedUrl ~ err", err);
    }
};

const putFile = async (vaultKey, storeName, destinationKey, sourcePath) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.GCP);

        await storageClient.bucket(storeName).upload(sourcePath, {
            destination: destinationKey,
        });
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: gcp.utils.js ~ putFile ~ err", err);
    }
};

module.exports = { createStore, getDownloadStream, getSignedUrl, putFile };
