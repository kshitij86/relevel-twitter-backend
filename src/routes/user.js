const { Router } = require("express");
const router = Router();
const {
  register,
  follow,
  getFollowers,
  getTweetsForUser,
  deleteUser,
  getUserStats,
} = require("../controllers/user.controller");
const {
  validateRequestBody,
  validateAuthorization,
} = require("../common/middleware/middleware");

/**
 * Route for all user related actions
 *
 */
router.post("/register", validateRequestBody, register);
router.post("/follow", validateAuthorization, validateRequestBody, follow);
router.get(
  "/get-followers",
  validateAuthorization,
  validateRequestBody,
  getFollowers
);
router.get(
  "/get-tweets",
  validateAuthorization,
  validateRequestBody,
  getTweetsForUser
);
router.get("/delete", validateAuthorization, validateRequestBody, deleteUser);
router.get("/stats", validateAuthorization, validateRequestBody, getUserStats);

module.exports = router;
