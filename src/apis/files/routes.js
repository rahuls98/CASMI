const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const multerMiddleware = require("../../middlewares/multer.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.get("/", iamMiddleware.verifyAccess(["admin", "user", "guest"]), controllers.readFiles);
router.get(
    "/:id",
    iamMiddleware.verifyAccess(["admin", "user", "guest"]),
    controllers.readFileById
);
router.post(
    "/upload",
    iamMiddleware.verifyAccess(["admin", "user"]),
    multerMiddleware.single("file"),
    bodyParser.json(),
    controllers.uploadFile
);
router.get(
    "/:id/download",
    iamMiddleware.verifyAccess(["admin", "user", "guest"]),
    controllers.downloadFile
);

module.exports = router;
