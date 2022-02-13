const { formatResponse, genJWTToken } = require("../common/helpers/util");
const { User } = require("../models");
const { compareSync } = require("bcryptjs");
const {
  AUTHENTICATION,
  HTTP_STATUS,
  COMMON,
} = require("../common/helpers/constants");
const { isEmpty } = require("lodash");

/**
 * Check if email and password match and return session token
 *
 * @param {*} req: In body pass through (email, password)
 * @param {*} res: Send a session token, or the apt error code
 */

const login = async (req, res) => {
  //login api logic here
  let response = formatResponse(AUTHENTICATION.LOGIN_SUCCESS);
  try {
    let { email, password } = req.body;
    const existingUser = await User.findOne({ email: email });
    if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = AUTHENTICATION.USER_NOT_FOUND;
    } else {
      if (compareSync(password, existingUser.password)) {
        //logged in successfully, send a signed token
        res.status(HTTP_STATUS.OK);
        response.data = [
          {
            auth_token: await genJWTToken(email),
          },
        ];
      } else {
        //login failure
        res.status(HTTP_STATUS.BAD_REQUEST);
        response.message = AUTHENTICATION.LOGIN_FAILURE;
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

module.exports = { login };
