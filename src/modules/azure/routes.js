const express = require("express");
const azureRouter = express.Router();
const azureControllers = require("./controllers");

azureRouter.get("/stores", azureControllers.getStores);
azureRouter.get("/files", azureControllers.getFiles);

module.exports = azureRouter;
