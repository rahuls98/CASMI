const express = require("express");
const router = express.Router();
const iamMiddleware = require("../../middlewares/iam.middleware");
const controllers = require("./controllers");

router.get("/template", iamMiddleware.verifyAccess(["admin"]), controllers.getTemplate);

module.exports = router;
