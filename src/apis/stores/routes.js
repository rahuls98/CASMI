const express = require("express");
const controllers = require("./controllers");
const iamMiddleware = require("../../middlewares/iam.middleware");

const router = express.Router();

router.get("/", iamMiddleware.verifyAccess(["admin", "programmatic"]), controllers.getStores);

module.exports = router;
