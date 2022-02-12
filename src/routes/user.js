const { Router } = require("express");
const router = Router();
const {
  register,
  follow,
  getFollowers,
  getTweetsForUser,
} = require("../controllers/user.controller");

// Create routes for user here
router.post("/register", register);
router.post("/follow", follow);
router.get("/get-followers", getFollowers);
router.get("/get-tweets", getTweetsForUser);

module.exports = router;
