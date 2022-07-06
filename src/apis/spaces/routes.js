const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.get("/", iamMiddleware.verifyAccess([]), controllers.readSpaces);
router.post("/", iamMiddleware.verifyAccess([]), bodyParser.json(), controllers.createSpace);
router.get("/:id", iamMiddleware.verifyAccess([]), controllers.readSpaceById);

module.exports = router;
