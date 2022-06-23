const aws = require("aws-sdk");
const { AWS_CONFIG } = require("../../config");

const awsClient = new aws.S3({
    region: AWS_CONFIG.REGION,
    accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
    secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
});

module.exports = awsClient;
