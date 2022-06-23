const express = require("express");
const multerHandler = require("../../middleware/multer.middleware");
const gcpRouter = express.Router();
const gcpControllers = require("./controllers");

gcpRouter.get("/stores", gcpControllers.getStores);
gcpRouter.get("/files", gcpControllers.getFiles);
gcpRouter.post("/upload", multerHandler.single("file"), gcpControllers.postFile);

module.exports = gcpRouter;
