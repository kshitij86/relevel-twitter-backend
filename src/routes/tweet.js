const express = require("express");
const router = express.Router();
const {
  tweet,
  likeTweet,
  deleteTweet,
} = require("../controllers/tweet.controller");

router.post("/new", tweet);
router.get("/like", likeTweet);
router.get("/delete", deleteTweet);

// Create routes for product here
module.exports = router;
