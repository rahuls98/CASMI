const fs = require("fs");
const {
    GetObjectCommand,
    ListBucketsCommand,
    ListObjectsCommand,
    PutObjectCommand,
} = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
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
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getStores ~ err", err);
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
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getFiles ~ err", err);
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
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ uploadFile ~ err", err);
    }
};

const getPresignedUrl = async () => {
    try {
        const params = {
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: ".gitignore",
            Body: "BODY",
        };
        const command = new GetObjectCommand(params);
        const signedUrl = await getSignedUrl(awsClient, command, {
            expiresIn: 20,
        });
        console.log(signedUrl);
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getPresignedUrl ~ err", err);
    }
};

const getDownloadStream = async () => {
    try {
        const params = {
            Bucket: AWS_CONFIG.BUCKET_NAME,
            Key: "AWS-Test/",
            Body: "BODY",
        };
        let filestream = await awsClient.send(new GetObjectCommand(params));
        return filestream.Body;
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: aws.utils.js ~ getDownloadStream ~ err", err);
    }
};

module.exports = { getStores, getFiles, uploadFile, getDownloadStream, getPresignedUrl };
