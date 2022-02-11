const jwt = require("jsonwebtoken");

const checkIfValid = (params) => {
  params.forEach((key) => {
    if (key === null || key === undefined) return false;
  });
  return true;
};

const formatResponse = (message, data) => {
  let formattedResponse = { message: message, data: data };
  return formattedResponse;
};

const genJWTToken = async (email, type) => {
  const expTime = 1000 * 60 * 60 * 60; //expires in 30 mins
  const authenticationToken = "AwerT$&*123PoqweCv";
  const token = jwt.sign({ id: email, type: type }, authenticationToken, {
    expiresIn: expTime,
  });
  return token;
};

const Util = {
  checkIfValid,
  formatResponse,
  genJWTToken,
};

module.exports = Util;
