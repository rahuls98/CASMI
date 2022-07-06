const errorLogger = require("../../helpers/error_logger");
const spacesModel = require("./models");
const storesModel = require("../stores/models");

const createSpace = async (req, res) => {
    try {
        if (!req.body.name || !req.body.provider_ids) {
            const response = { success: false, message: "Insufficient space data!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            const createSpaceResponse = await spacesModel.create({ name: req.body.name });
            const spaceId = createSpaceResponse["insertId"];
            let associateProviderResponse, createStoreResponse;
            for (let providerId of req.body.provider_ids) {
                associateProviderResponse = await spacesModel.associateProvider(
                    spaceId,
                    providerId
                );
                createStoreResponse = await storesModel.create({
                    name: req.body.name,
                    space_id: spaceId,
                    provider_id: providerId,
                });
            }
            const response = { success: true, space_id: spaceId };
            res.header("Content-Type", "application/json");
            res.status(201).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ createSpace ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readSpaces = async (req, res) => {
    try {
        const readSpacesResponse = await spacesModel.read();
        for (let space of readSpacesResponse) {
            space["provider_ids"] = space["provider_ids"].split(",").map((id) => Number(id));
        }
        const response = { success: true, spaces: readSpacesResponse };
        res.header("Content-Type", "application/json");
        res.status(200).send(JSON.stringify(response, null, 4));
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readSpaces ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

const readSpaceById = async (req, res) => {
    try {
        const readSpaceResponse = await spacesModel.readById(req.params.id);
        if (readSpaceResponse.length == 0) {
            const response = { success: false, message: "No such space!" };
            res.header("Content-Type", "application/json");
            res.status(400).send(JSON.stringify(response, null, 4));
        } else {
            readSpaceResponse[0]["provider_ids"] = readSpaceResponse[0]["provider_ids"]
                .split(",")
                .map((id) => Number(id));
            const response = { success: true, space: readSpaceResponse[0] };
            res.header("Content-Type", "application/json");
            res.status(200).send(JSON.stringify(response, null, 4));
        }
    } catch (err) {
        errorLogger("DEBUG LOG ~ file: controllers.js ~ readSpaceById ~ err", err);
        const response = { success: false, message: err.message };
        res.header("Content-Type", "application/json");
        res.status(500).send(JSON.stringify(response, null, 4));
    }
};

module.exports = { createSpace, readSpaces, readSpaceById };
