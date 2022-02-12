const { User } = require("../models");
const { isEmpty } = require("lodash");
const { hashSync, genSaltSync } = require("bcryptjs");
const {
  AUTHENTICATION,
  HTTP_STATUS,
  COMMON,
  TWEET,
} = require("../common/helpers/constants");
const { checkIfValid, formatResponse } = require("../common/helpers/util");
const Tweet = require("../models/Tweet");

const register = async (req, res) => {
  //register api logic here
  let response = formatResponse(AUTHENTICATION.REGISTER_SUCCESS, []);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      let { username, email, password } = req.body;
      const existingUser = await User.findOne({ email: email }).catch((err) =>
        console.error(err)
      );
      await genSaltSync(10);
      const hashed_password = await hashSync(password);
      if (isEmpty(existingUser)) {
        const newUser = {
          username: username,
          email: email,
          password: hashed_password,
        };
        await User.create(newUser);
        res.status(HTTP_STATUS.RESOURCE_CREATED);
        response.data = { username: username, email: email };
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
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      let { following_user_id, followed_user_id } = req.body;
      let response = formatResponse(
        `${following_user_id} is now following ${followed_user_id}`,
        []
      );
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
  let response = formatResponse(COMMON.ACTION_SUCCESS);

  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.ACTION_FAILURE;
    } else {
      let { user_id } = req.body;

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

const getTweetsForUser = async (req, res) => {
  //get all tweets for a user api logic here
  let response = formatResponse(TWEET.TWEET_FETCH_SUCCESS, []);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.EMPTY_PARAMETERS;
    } else {
      let { user_id } = req.body;
      const existingUser = await User.findOne({ user_id: user_id });
      if (isEmpty(existingUser)) {
        res.status(HTTP_STATUS.BAD_REQUEST);
        response.message = TWEET.TWEET_USER_NOT_FOUND;
      } else {
        let tweetsForUser = [];
        let allTweets = await Tweet.find({ created_by: user_id });
        allTweets.forEach((item) =>
          tweetsForUser.push({
            likes: item.likes,
            tweet_id: item.tweet_id,
            tweet_body: item.tweet_body,
          })
        );
        response.data = tweetsForUser;
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = TWEET.TWEET_FETCH_FAILURE;
    console.error(err);
  }
  res.send(response);
};

const deleteUser = async (req, res) => {
  //delete user here
  //if user is deleted, all his tweets should automatically be deleted as well
  let response = formatResponse(AUTHENTICATION.USER_DELETE_SUCCESS, []);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.EMPTY_PARAMETERS;
    } else {
      let { user_id } = req.body;
      const existingUser = await User.findOne({ user_id: user_id });
      if (isEmpty(existingUser)) {
        res.status(HTTP_STATUS.BAD_REQUEST);
        response.message = AUTHENTICATION.USER_NOT_FOUND;
      } else {
        await Tweet.deleteMany({ created_by: user_id });
        await User.deleteOne({ user_id: user_id });
        res.status(HTTP_STATUS.OK);
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = AUTHENTICATION.USER_DELETE_FAILED;
    console.error(err);
  }
  res.send(response);
};

const UserController = {
  register,
  follow,
  getFollowers,
  getUserStats,
  searchUsers,
  getTweetsForUser,
  deleteUser,
};

module.exports = UserController;
