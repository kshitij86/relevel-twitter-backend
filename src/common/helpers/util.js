const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../../config/config");

/**
 * Format an HTTP response, based on message and data provided
 */
const formatResponse = (message, data) => {
  let formattedResponse = { message: message, data: data };
  return formattedResponse;
};

/**
 * Sign a JWT token to authorize requests to protected resources
 */
const genJWTToken = async (email) => {
  const expTime = 1000 * 60 * 60 * 60; //expires in 30 mins
  const token = jwt.sign({ email: email }, JWT_SECRET, {
    expiresIn: expTime,
  });
  return token;
};

module.exports = {
  formatResponse,
  genJWTToken,
};
