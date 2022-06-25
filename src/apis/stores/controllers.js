const awsUtils = require("../../utils/aws.utils");
const azureUtils = require("../../utils/azure.utils");
const gcpUtils = require("../../utils/gcp.utils");

const getStores = async (req, res) => {
    const awsStores = await awsUtils.getStores();
    const azureStores = await azureUtils.getStores();
    const gcpStores = await gcpUtils.getStores();
    const response = {
        success: true,
        data: {
            files: {
                aws: awsStores,
                azure: azureStores,
                gcp: gcpStores,
            },
        },
    };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(response, null, 4));
};

module.exports = { getStores };
