const {
    BlobServiceClient,
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} = require("@azure/storage-blob");
const errorLogger = require("../../helpers/error_logger");
const { vault, appRoleConfig } = require("../../vault");
const dotenv = require("dotenv");
dotenv.config();

const getStorageClient = (config) => {
    return BlobServiceClient.fromConnectionString((connectionString = config["CONNECTION_STRING"]));
};

const createStore = async (vaultKey, storeName) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AZR);

        const containerClient = storageClient.getContainerClient(storeName);
        const createContainerResponse = await containerClient.create();
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ createStore ~ err", err);
    }
};

const getDownloadStream = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AZR);

        const containerClient = storageClient.getContainerClient(storeName);
        const blockBlobClient = containerClient.getBlockBlobClient(sourceKey);
        const downloadBlockBlobResponse = await blockBlobClient.download(0);
        return downloadBlockBlobResponse.readableStreamBody;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ getDownloadStream ~ err", err);
    }
};

const getSignedUrl = async (vaultKey, storeName, sourceKey) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AZR);

        const containerClient = storageClient.getContainerClient(storeName);
        const blockBlobClient = containerClient.getBlockBlobClient(sourceKey);
        const sharedKeyCredential = new StorageSharedKeyCredential(
            data.data.AZR["STORAGE_ACCOUNT"],
            data.data.AZR["AZURE_STORAGE_ACCESS_KEY"]
        );
        const sasToken = generateBlobSASQueryParameters(
            {
                containerName: storeName,
                blobName: sourceKey,
                expiresOn: new Date(Date.now() + process.env.SIGNED_URL_EXPIRY_SECONDS * 1000),
                permissions: BlobSASPermissions.parse("racwd"),
            },
            sharedKeyCredential
        );
        const signedUrl = `${blockBlobClient.url}?${sasToken}`;
        return signedUrl;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ getDownloadStream ~ err", err);
    }
};

const putFile = async (vaultKey, storeName, destinationKey, sourcePath) => {
    try {
        const vaultLoginResponse = await vault.approleLogin(appRoleConfig);
        vault.token = vaultLoginResponse.auth.client_token;
        const { data } = await vault.read(vaultKey);
        const storageClient = getStorageClient(data.data.AZR);

        const containerClient = storageClient.getContainerClient(storeName);
        const blockBlobClient = containerClient.getBlockBlobClient(destinationKey);
        await blockBlobClient.uploadFile(sourcePath);
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ putFile ~ err", err);
    }
};

module.exports = { createStore, getDownloadStream, getSignedUrl, putFile };
