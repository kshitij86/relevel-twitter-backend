const { User } = require("../models");
const {
  AUTHENTICATION,
  HTTP_STATUS,
  COMMON,
} = require("../common/helpers/constants");
const { checkIfValid, formatResponse } = require("../common/helpers/util");

const register = async (req, res) => {
  //register api logic here
  let { name, email, password } = req.body;
  let response = formatResponse(AUTHENTICATION.REGISTER_SUCCESS, "");
  try {
    if (!checkIfValid([name, email, password])) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      const existingUser = await User.findOne({ email: email }).catch((err) =>
        console.error(err)
      );
      if (isEmpty(existingUser)) {
        const newUser = {
          name: name,
          email: email,
          password: password,
        };
        await User.create(newUser);
        res.status(HTTP_STATUS.RESOURCE_CREATED);
        response.data = { name: name, email: email };
      } else {
        res.status(HTTP_STATUS.BAD_REQUEST);
        response.message = AUTHENTICATION.EXISTING_USER;
      }
    }
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = AUTHENTICATION.REGISTER_FAILURE;
  }

  res.send(response);
};

const follow = async (req, res) => {
  //follow api logic here
  let { following_user_id, followed_user_id } = req.body;
  let response = formatResponse(
    `${following_user_id} is now following ${followed_user_id}`,
    []
  );
  try {
    if (!checkIfValid([followed_user_id, following_user_id])) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      const followed_user = await User.findOne({ user_id: followed_user_id });
      const following_user = await User.findOne({ user_id: following_user_id });
      const usersExist = !isEmpty(followed_user) && !isEmpty(following_user);

      //Only if both users exist
      if (usersExist) {
        if (followed_user.followers.includes(following_user_id)) {
          //If followed_user is already followed by following_user
          res.status(HTTP_STATUS.ALREADY_EXISTS);
          response = formatResponse(
            `${following_user_id} already follows ${followed_user_id}`
          );
        } else {
          await User.findOneAndUpdate(
            { user_id: followed_user_id },
            {
              $push: {
                followers: following_user_id,
              },
            }
          );
          res.status(HTTP_STATUS.OK);
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

const getFollowers = async (req, res) => {
  //getFollowers api logic here
  const { user_id } = req.body;
  let response = formatResponse(COMMON.ACTION_SUCCESS);

  try {
    if (!checkIfValid([user_id])) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      await User.findOne({ user_id: user_id }).then((existingUser) => {
        response.data = existingUser.followers;
      });
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

const getUserStats = (req, res) => {
  //getUserStats api logic here
};

const searchUsers = (req, res) => {
  //searchUsers api logic here
};

const getTweetsForUser = (req, res) => {
  //get all tweets for a user api logic here
};

const UserController = {
  register,
  follow,
  getFollowers,
  getUserStats,
  searchUsers,
  getTweetsForUser,
};

module.exports = UserController;
