const express = require("express");
const gcpRouter = express.Router();
const gcpControllers = require("./controllers");

gcpRouter.get("/stores", gcpControllers.getStores);
gcpRouter.get("/files", gcpControllers.getFiles);

module.exports = gcpRouter;
