const getProviders = (req, res) => {
    const response = {
        success: true,
        providers: [
            { id: 1, name: "aws" },
            { id: 2, name: "azure" },
            { id: 3, name: "gcp" },
        ],
    };
    res.header("Content-Type", "application/json");
    res.send(JSON.stringify(response, null, 4));
};

module.exports = { getProviders };
