const awsUtils = require("../../utils/aws.utils");
const azureUtils = require("../../utils/azure.utils");
const gcpUtils = require("../../utils/gcp.utils");

const getFiles = async (req, res) => {
    const awsFiles = await awsUtils.getFiles();
    const azureFiles = await azureUtils.getFiles();
    const gcpFiles = await gcpUtils.getFiles();
    const response = {
        success: true,
        data: {
            files: {
                aws: awsFiles,
                azure: azureFiles,
                gcp: gcpFiles,
            },
        },
    };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(response, null, 4));
};

const uploadFile = async (req, res) => {
    const fileName = req.file.originalname;
    const filePath = req.file.path;
    switch (req.body.cloud) {
        case "aws":
            await awsUtils.uploadFile(fileName, filePath);
            break;
        case "azure":
            await azureUtils.uploadFile(fileName, filePath);
            break;
        case "gcp":
            await gcpUtils.uploadFile(fileName, filePath);
            break;
    }
    res.send({ success: true });
};

module.exports = { getFiles, uploadFile };
