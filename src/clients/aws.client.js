const { S3Client } = require("@aws-sdk/client-s3");
const { AWS_CONFIG } = require("../../config");

module.exports = new S3Client({
    region: AWS_CONFIG.REGION,
    credentials: {
        accessKeyId: AWS_CONFIG.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY,
    },
});
