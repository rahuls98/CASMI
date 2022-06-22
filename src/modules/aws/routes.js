const express = require("express");
const awsRouter = express.Router();
const awsControllers = require("./controllers");

awsRouter.get("/stores", awsControllers.getStores);
awsRouter.get("/files", awsControllers.getFiles);

module.exports = awsRouter;
