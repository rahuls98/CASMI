const foldersModel = require("./models");
const errorLogger = require("../../helpers/error_logger");

const readFolders = async (req, res) => {
    try {
        const readFoldersResponse = await foldersModel.read();
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
    const inputIsValid = () => !!Number(req.params.id);
    try {
        if (!inputIsValid()) {
            const response = { success: false, message: "Invalid folder id!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
            return;
        }
        const readFolderResponse = await foldersModel.readById(req.params.id);
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
