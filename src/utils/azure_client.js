const { BlobServiceClient } = require("@azure/storage-blob");
const { AZURE_CONFIG } = require("../config");

const azureClient = BlobServiceClient.fromConnectionString(AZURE_CONFIG.CONNECTION_STRING);

module.exports = azureClient;
