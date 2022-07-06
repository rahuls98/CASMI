const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const controllers = require("./controllers");

router.post("/login", bodyParser.json(), controllers.login);

module.exports = router;
