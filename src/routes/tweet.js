const express = require("express");
const router = express.Router();
const {
  tweet,
  likeTweet,
  deleteTweet,
} = require("../controllers/tweet.controller");
const {
  validateRequestBody,
  validateAuthorization,
} = require("../common/middleware/middleware");

/**
 * Route for all tweet related actions
 */

router.post("/new", validateAuthorization, validateRequestBody, tweet);
router.get("/like", validateAuthorization, validateRequestBody, likeTweet);
router.get("/delete", validateAuthorization, validateRequestBody, deleteTweet);

module.exports = router;
