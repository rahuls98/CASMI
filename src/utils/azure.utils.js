const azureClient = require("../clients/azure.client");
const { AZURE_CONFIG } = require("../../config");
const errorLogger = require("../helpers/error_logger");

const {
    StorageSharedKeyCredential,
    BlobSASPermissions,
    generateBlobSASQueryParameters,
} = require("@azure/storage-blob");

const getStores = async () => {
    try {
        const containers = azureClient.listContainers();
        let stores = [];
        for await (const container of containers) {
            stores.push(container.name);
        }
        return stores;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ getStores ~ err", err);
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
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ getFiles ~ err", err);
    }
};

const uploadFile = async (fileName, filePath) => {
    try {
        const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadFile(filePath);
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: azure.utils.js ~ uploadFile ~ err", err);
    }
};

const getPresignedUrl = async () => {
    const AZURE_STORAGE_ACCOUNT = "exlhackathonstorage";
    const AZURE_STORAGE_ACCESS_KEY =
        "UQFMDfiTfvOlsAFkZZ4C4X+tjuUahogx9aTcR/hqNkFYq4EGQHf+pPOi1+opVu/fqdE43b0Iroz1+AStBItGQw==";
    const sharedKeyCredential = new StorageSharedKeyCredential(
        AZURE_STORAGE_ACCOUNT,
        AZURE_STORAGE_ACCESS_KEY
    );

    const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(".gitignore");
    const sasToken = generateBlobSASQueryParameters(
        {
            containerName: AZURE_CONFIG.BUCKET_NAME,
            blobName: ".gitignore",
            expiresOn: new Date(Date.now() + 20 * 1000),
            permissions: BlobSASPermissions.parse("racwd"),
        },
        sharedKeyCredential
    );

    const sasUrl = `${blockBlobClient.url}?${sasToken}`;

    console.log(sasUrl);
};

const getDownloadStream = async () => {
    const containerClient = azureClient.getContainerClient(AZURE_CONFIG.BUCKET_NAME);
    const blockBlobClient = containerClient.getBlockBlobClient(".gitignore");
    const downloadBlockBlobResponse = await blockBlobClient.download(0);
    return downloadBlockBlobResponse.readableStreamBody;
};

module.exports = { getStores, getFiles, uploadFile, getDownloadStream };
