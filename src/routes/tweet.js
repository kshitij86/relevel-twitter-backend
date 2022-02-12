const express = require("express");
const router = express.Router();
const { tweet, likeTweet } = require("../controllers/tweet.controller");

router.post("/new", tweet);
router.post("/like", likeTweet);

// Create routes for product here
module.exports = router;
