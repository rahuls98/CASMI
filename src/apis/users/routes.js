const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.post("/login", bodyParser.json(), controllers.loginUser);
router.post("/", iamMiddleware.verifyAccess(["admin"]), bodyParser.json(), controllers.createUser);

module.exports = router;
