const express = require("express");
const router = express.Router({ mergeParams: true });

const { handleHealthRequest } = require("../controllers/health");

router.route("/").get(handleHealthRequest);

module.exports = router;