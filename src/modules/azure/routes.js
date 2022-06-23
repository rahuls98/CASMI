const express = require("express");
const multerHandler = require("../../middleware/multer.middleware");
const azureRouter = express.Router();
const azureControllers = require("./controllers");

azureRouter.get("/stores", azureControllers.getStores);
azureRouter.get("/files", azureControllers.getFiles);
azureRouter.post("/upload", multerHandler.single("file"), azureControllers.postFile);

module.exports = azureRouter;
