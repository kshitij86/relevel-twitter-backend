const { Router } = require("express");
const router = Router();
const UserController = require("../controllers/user.controller");
const { register, follow, getFollowers } = UserController;

// Create routes for user here
router.post("/register", register);
router.post("/follow", follow);
router.get("/get-followers", getFollowers);
module.exports = router;
