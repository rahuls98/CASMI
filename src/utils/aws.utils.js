const fs = require("fs");
const { ListBucketsCommand, ListObjectsCommand, PutObjectCommand } = require("@aws-sdk/client-s3");
const awsClient = require("../clients/aws.client");
const { AWS_CONFIG } = require("../../config");
const errorLogger = require("../helpers/error_logger");

const getStores = async () => {
    try {
        const buckets = await awsClient.send(new ListBucketsCommand({}));
        const stores = [];
        for (let bucket of buckets.Buckets) {
            stores.push(bucket.Name);
        }
        return stores;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ line 15 ~ getStores ~ err", err);
    }
};

const getFiles = async () => {
    try {
        const objects = await awsClient.send(
            new ListObjectsCommand({ Bucket: AWS_CONFIG.BUCKET_NAME })
        );
        let files = [];
        for (let object of objects.Contents) {
            files.push(object.Key);
        }
        return files;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ line 31 ~ getFiles ~ err", err);
    }
};

const uploadFile = async (fileName, filePath) => {
    try {
        const params = {
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: fileName,
            Body: fs.readFileSync(filePath),
        };
        await awsClient.send(new PutObjectCommand(params));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ line 44 ~ uploadFile ~ err", err);
    }
};

module.exports = { getStores, getFiles, uploadFile };
