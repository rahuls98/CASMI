const aws_utils = require("./utils/aws.utils");
const azure_utils = require("./utils/azure.utils");
const gcp_utils = require("./utils/gcp.utils");

const getUtils = (providerCode) => {
    switch (providerCode) {
        case "aws":
            return aws_utils;
        case "azr":
            return azure_utils;
        case "gcp":
            return gcp_utils;
    }
};

module.exports = { getUtils };
