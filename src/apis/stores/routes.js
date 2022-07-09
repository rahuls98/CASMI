const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.get("/", iamMiddleware.verifyAccess(["admin", "user"]), controllers.readStores);
router.get("/:id", iamMiddleware.verifyAccess(["admin", "user"]), controllers.readStoreById);

module.exports = router;
