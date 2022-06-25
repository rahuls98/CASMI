const express = require("express");
const controllers = require("./controllers");
const multerHandler = require("../../middlewares/multer.middleware");

const router = express.Router();

router.get("/", controllers.getFiles);
router.post("/upload", multerHandler.single("file"), controllers.uploadFile);

module.exports = router;
