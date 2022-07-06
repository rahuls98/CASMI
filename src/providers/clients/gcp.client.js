const { Storage } = require("@google-cloud/storage");
const { GCP_CONFIG } = require("../../../config");

module.exports = new Storage({
    credentials: GCP_CONFIG.GC_SA_CREDENTIALS,
    projectId: GCP_CONFIG.PROJECT_ID,
});
