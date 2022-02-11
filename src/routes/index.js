const { Router } = require("express");
const routes = Router();

routes.use("/auth", require("./auth"));
routes.use("/tweet", require("./tweet"));
routes.use("/user", require("./user"));


module.exports = routes; 