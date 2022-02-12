const {
  formatResponse,
  checkIfValid,
  genJWTToken,
} = require("../common/helpers/util");
const { User } = require("../models");
const { compareSync } = require("bcryptjs");
const {
  AUTHENTICATION,
  HTTP_STATUS,
  COMMON,
} = require("../common/helpers/constants");
const { isEmpty } = require("lodash");

const login = async (req, res) => {
  //login api logic here
  let response = formatResponse(AUTHENTICATION.LOGIN_SUCCESS);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.INVALID_REQUEST;
    } else {
      let { email, password } = req.body;
      const existingUser = await User.findOne({ email: email });
      if (isEmpty(existingUser)) {
        res.status(HTTP_STATUS.BAD_REQUEST);
        response.message = AUTHENTICATION.USER_NOT_FOUND;
      } else {
        if (compareSync(password, existingUser.password)) {
          //login success, send a signed token
          res.status(HTTP_STATUS.OK);
          response.data = [
            {
              auth_token: await genJWTToken(),
            },
          ];
        } else {
          //login failure
          res.status(HTTP_STATUS.BAD_REQUEST);
          response.message = AUTHENTICATION.LOGIN_FAILURE;
        }
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

const AuthController = {
  login,
};

module.exports = AuthController;
