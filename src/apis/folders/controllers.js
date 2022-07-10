const folderQueries = require("./queries");
const errorLogger = require("../../helpers/error_logger");
const validators = require("../../helpers/validators");

const readFolders = async (req, res) => {
    try {
        const readFoldersResponse = await folderQueries.read();
        const response = { success: true, folders: readFoldersResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readFolders ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readFolderById = async (req, res) => {
    const validateInput = () => {
        let requiredKeys = ["id"];
        let hasRequiredKeys = validators.hasKeys(req.params, requiredKeys);
        if (!hasRequiredKeys) return [false, "Insufficient data to perform request!"];
        if (!Number(req.params.id)) return [false, "ID not a number!"];
        return [true, ""];
    };
    try {
        const validateInputResponse = validateInput();
        if (!validateInputResponse[0]) {
            const response = { success: false, message: validateInputResponse[1] };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readFolderResponse = await folderQueries.readById(req.params.id);
        if (readFolderResponse.length == 0) {
            const response = { success: false, message: "No such folder!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const response = { success: true, folder: readFolderResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readFolderById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { readFolders, readFolderById };
