const { Storage } = require("@google-cloud/storage");
const { GCP_CONFIG } = require("../config");

const gcpClient = new Storage({
    keyFilename: GCP_CONFIG.GCP_KEY_FILE,
    projectId: GCP_CONFIG.PROJECT_ID,
});

module.exports = gcpClient;
