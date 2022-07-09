const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const controllers = require("./controllers");

router.get("/", iamMiddleware.verifyAccess(["admin", "user"]), controllers.readFolders);
router.get("/:id", iamMiddleware.verifyAccess(["admin", "user"]), controllers.readFolderById);

module.exports = router;
