const express = require("express");
const router = express.Router();
const { login } = require("../controllers/auth.controller");

/**
 * Route to login a user and return a JWT session token
 *
 * @api {post} /user/login
 * @apiName Login
 * @apiGroup Auth
 *
 * @apiSuccess (Success 200) {text}
 * @apiError {text} 401/Unauthorized.
 * @apiError {text} 404/Not Foud Unknown userId
 */
router.post("/login", login);

module.exports = router;
