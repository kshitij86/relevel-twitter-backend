const { Router } = require("express");
const router = Router();
const UserController = require("../controllers/user.controller");

// Create routes for user here
router.post("/register", UserController.register);
router.post("/follow", UserController.follow);
router.get("/get-followers", UserController.getFollowers);
module.exports = router;
