const fs = require("fs");
const awsClient = require("../../utils/aws_client");
const { AWS_CONFIG } = require("../../../config");

const getStores = (req, res, next) => {
    awsClient.listBuckets((err, data) => {
        if (err) throw err;
        const stores = data.Buckets;
        let storeNames = [];
        for (let store of stores) {
            storeNames.push(store.Name);
        }
        res.send({ success: true, stores: storeNames });
    });
};

const getFiles = async (req, res, next) => {
    const params = {
        Bucket: AWS_CONFIG.BUCKET_NAME,
    };
    awsClient.listObjects(params, (err, data) => {
        if (err) throw err;
        const files = data.Contents;
        let fileNames = [];
        for (let file of files) {
            fileNames.push(file.Key);
        }
        res.send({ success: true, files: fileNames });
    });
};

const postFile = async (req, res, next) => {
    const params = {
        Bucket: AWS_CONFIG.BUCKET_NAME,
        Key: req.file.originalname,
        Body: fs.readFileSync(req.file.path),
    };
    awsClient.upload(params, (err, data) => {
        if (err) throw err;
        res.send({ success: true });
    });
};

module.exports = { getStores, getFiles, postFile };
