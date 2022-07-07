const express = require("express");
const router = express.Router();
const controllers = require("./controllers");

router.get("/", controllers.readFolders);
router.get("/:id", controllers.readFolderById);

module.exports = router;
