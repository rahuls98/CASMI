const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const multerMiddleware = require("../../middlewares/multer.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.post("/upload", multerMiddleware.single("file"), bodyParser.json(), controllers.uploadFile);
router.get("/:id/download", iamMiddleware.verifyAccess([]), controllers.downloadFile);

module.exports = router;
