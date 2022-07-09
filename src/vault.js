const dotenv = require("dotenv");
dotenv.config();

const vault = require("node-vault")({
    apiVersion: "v1",
    endpoint: process.env.CASMI_VAULT_ENDPOINT,
});

const appRoleConfig = {
    role_id: process.env.CASMI_SERVER_ROLE_ID,
    secret_id: process.env.CASMI_SERVER_SECRET_ID,
};

module.exports = { vault, appRoleConfig };
