const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.get("/", iamMiddleware.verifyAccess([]), controllers.readProviders);
router.post("/", iamMiddleware.verifyAccess([]), bodyParser.json(), controllers.createProvider);
router.get("/:id", iamMiddleware.verifyAccess([]), controllers.readProviderById);

module.exports = router;
