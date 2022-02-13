const { Router } = require("express");
const routes = Router();
/**
 * Index route for all API routes
 *
 */

routes.use("/auth", require("./auth"));
routes.use("/tweet", require("./tweet"));
routes.use("/user", require("./user"));

module.exports = routes;
