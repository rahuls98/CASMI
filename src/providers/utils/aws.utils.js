const fs = require("fs");
const {
    S3Client,
    CreateBucketCommand,
    GetObjectCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl: getPresignedUrl } = require("@aws-sdk/s3-request-presigner");
const errorLogger = require("../../helpers/error_logger");
const { vault, appRoleConfig } = require("../../vault");

const getStorageClient = (config) => {
    return new S3Client({
        region: config["REGION"],
        credentials: {
            accessKeyId: config["ACCESS_KEY_ID"],
            secretAccessKey: config["SECRET_ACCESS_KEY"],
        },
    });
};

const createStore = async (vaultKey, storeName) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AWS);

        const params = {
            Bucket: storeName,
        };
        const response = await storageClient.send(new CreateBucketCommand(params));
    } catch (err) {
        console.log("DEBUG LOG ~ file: aws.utils.js ~ createStore ~ err", err);
    }
};

const getDownloadStream = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AWS);

        const params = {
            Bucket: storeName,
            Key: sourceKey,
            Body: "",
        };
        let filestream = await storageClient.send(new GetObjectCommand(params));
        return filestream.Body;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getDownloadStream ~ err", err);
    }
};

const getSignedUrl = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AWS);

        const params = {
            Bucket: storeName,
            Key: sourceKey,
            Body: "",
        };
        const command = new GetObjectCommand(params);
        const signedUrl = await getPresignedUrl(storageClient, command, { expiresIn: 20 });
        return signedUrl;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getPresignedUrl ~ err", err);
    }
};

const putFile = async (vaultKey, storeName, destinationKey, sourcePath) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AWS);

        const params = {
            Bucket: storeName,
            Key: destinationKey,
            Body: fs.readFileSync(sourcePath),
        };
        await storageClient.send(new PutObjectCommand(params));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ putFile ~ err", err);
    }
};

module.exports = { createStore, getDownloadStream, getSignedUrl, putFile };
