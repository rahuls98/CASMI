const { BlobServiceClient } = require("@azure/storage-blob");
const { AZURE_CONFIG } = require("../../../config");

module.exports = BlobServiceClient.fromConnectionString(
    (connectionString = AZURE_CONFIG.CONNECTION_STRING)
);
