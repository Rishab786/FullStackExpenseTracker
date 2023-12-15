const express = require("express");
const errorPageController = require("../controllers/errorPage");
const router = express.Router();

router.get("/*", errorPageController.getErrorPage);

module.exports = router;