const asyncHandler = require("../middleware/async");

exports.handleHealthRequest = asyncHandler(async (req, res, next) => {
  res
    .status(200)
    .json({ data: "Register Service is Running", version: 1.0 });
});