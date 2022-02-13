const { isEmpty } = require("lodash");
const { HTTP_STATUS, COMMON, AUTHENTICATION } = require("../helpers/constants");
const { formatResponse } = require("../helpers/util");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config");

/**
 * Middleware to check for empty request body and return appropriate error response
 */

const validateRequestBody = (req, res, next) => {
  let response = formatResponse(COMMON.EMPTY_PARAMETERS);
  if (isEmpty(req.body)) {
    res.status(HTTP_STATUS.BAD_REQUEST);
    res.send(response);
  } else {
    next();
  }
};

/**
 * Middleware to check for unauthorized access to protected resources
 */
const validateAuthorization = async (req, res, next) => {
  let response = formatResponse("", []);
  let hasError = false;

  const authToken = req.get("Authorization");
  if (isEmpty(authToken)) {
    hasError = true;
    res.status(HTTP_STATUS.AUTH_FAILURE);
    response.message = AUTHENTICATION.NO_TOKEN;
  } else {
    const decoded = jwt.verify(authToken, JWT_SECRET);
    if (decoded.exp <= Date.now() / 1000) {
      hasError = true;
      response.message = AUTHENTICATION.TOKEN_EXPIRED;
    }
  }
  if (hasError) {
    res.send(response);
  } else {
    next();
  }
};

module.exports = {
  validateRequestBody,
  validateAuthorization,
};
