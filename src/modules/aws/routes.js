const express = require("express");
const multerHandler = require("../../middleware/multer.middleware");
const awsRouter = express.Router();
const awsControllers = require("./controllers");

awsRouter.get("/stores", awsControllers.getStores);
awsRouter.get("/files", awsControllers.getFiles);
awsRouter.post("/upload", multerHandler.single("file"), awsControllers.postFile);

module.exports = awsRouter;
