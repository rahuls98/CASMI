const getTemplate = (req, res) => {
    const response = {
        success: true,
        template: {
            AWS: {
                REGION: "",
                ACCESS_KEY_ID: "",
                SECRET_ACCESS_KEY: "",
            },
            AZR: {
                CONNECTION_STRING: "",
                STORAGE_ACCOUNT: "",
                AZURE_STORAGE_ACCESS_KEY: "",
            },
            GCP: {
                PROJECT_ID: "",
                SERVICE_ACCOUNT_CREDENTIALS: {
                    auth_provider_x509_cert_url: "",
                    auth_uri: "",
                    client_email: "",
                    client_id: "",
                    client_x509_cert_url: "",
                    private_key: "",
                    private_key_id: "",
                    project_id: "",
                    token_uri: "",
                    type: "",
                },
            },
        },
    };
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify(response, null, 4));
};

module.exports = { getTemplate };
