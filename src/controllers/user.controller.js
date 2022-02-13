const { User } = require("../models");
const { isEmpty, isNull } = require("lodash");
const { hashSync, genSaltSync } = require("bcryptjs");
const {
  AUTHENTICATION,
  HTTP_STATUS,
  COMMON,
  TWEET,
} = require("../common/helpers/constants");
const { formatResponse } = require("../common/helpers/util");
const Tweet = require("../models/Tweet");

/**
 * Register a new user onto the platform
 *
 * @param {*} req: In body pass through (username, email, password)
 * @param {*} res: Return error code as per API's document
 */

const register = async (req, res) => {
  let response = formatResponse(AUTHENTICATION.REGISTER_SUCCESS, []);
  try {
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
      res.status(HTTP_STATUS.ALREADY_EXISTS);
      response.message = AUTHENTICATION.EXISTING_USER;
    }
  } catch (err) {
    console.error(err);
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = AUTHENTICATION.REGISTER_FAILURE;
  }

  res.send(response);
};

/**
 * Perform a follow action, where one user follows another
 *
 * @param {*} req: In body pass through (following_user_id, followed_user_id)
 * @param {*} res: Return error code as per API's document
 */

const follow = async (req, res) => {
  let response;
  try {
    let { following_user_id, followed_user_id } = req.body;
    response = formatResponse(
      `${following_user_id} is now following ${followed_user_id}`,
      []
    );
    const followed_user = await User.findOne({ user_id: followed_user_id });
    const following_user = await User.findOne({ user_id: following_user_id });
    const usersExist =
      !isEmpty(followed_user) &&
      !isNull(followed_user) &&
      !isNull(following_user) &&
      !isEmpty(following_user);

    console.log(usersExist);

    //Perform action only if both users exist
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
            $inc: {
              followers_count: 1,
            },
            $push: {
              followers: following_user_id,
            },
          }
        );
        res.status(HTTP_STATUS.OK);
      }
    } else {
      res.status(HTTP_STATUS.NOT_FOUND);
      response.message = AUTHENTICATION.USER_NOT_FOUND;
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Fetch all  followers for a particular user
 *
 * @param {*} req: In body pass through (user_id)
 * @param {*} res: Return error code as per API's document
 */
const getFollowers = async (req, res) => {
  //getFollowers api logic here
  let response = formatResponse(COMMON.ACTION_SUCCESS);

  try {
    let { user_id } = req.body;

    await User.findOne({ user_id: user_id }).then((existingUser) => {
      response.data = existingUser.followers;
    });
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Fetch statistics for a user
 *
 * @param {*} req: In body pass through (user_id)
 * @param {*} res: Return error code as per API's document
 */
const getUserStats = async (req, res) => {
  let response = formatResponse(AUTHENTICATION.USER_STATS_SUCCESS, []);
  try {
    let { user_id } = req.body;
    const existingUser = await User.findOne({ user_id: user_id });
    if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = TWEET.TWEET_USER_NOT_FOUND;
    } else {
      res.status(HTTP_STATUS.OK);
      response.data = [
        {
          username: existingUser.username,
          email: existingUser.email,
          date_registered: existingUser.date_registered,
          followers_count: existingUser.followers_count,
          tweets_count: existingUser.tweets_count,
        },
      ];
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = AUTHENTICATION.USER_STATS_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Fetch all tweets for a user
 *
 * @param {*} req: In body pass through (user_id)
 * @param {*} res: Return error code as per API's document
 */
const getTweetsForUser = async (req, res) => {
  let response = formatResponse(TWEET.TWEET_FETCH_SUCCESS, []);
  try {
    let { user_id } = req.body;
    const existingUser = await User.findOne({ user_id: user_id });
    if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.NOT_FOUND);
      response.message = TWEET.TWEET_USER_NOT_FOUND;
    } else {
      let tweetsForUser = [];
      let allTweets = await Tweet.find({ created_by: user_id });
      allTweets.forEach((tweet) =>
        tweetsForUser.push({
          likes: tweet.likes,
          tweet_id: tweet.tweet_id,
          tweet_body: tweet.tweet_body,
        })
      );
      res.status(HTTP_STATUS.OK);
      response.data = tweetsForUser;
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = TWEET.TWEET_FETCH_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Delete a user from the platform
 * If a user is deleted, all his tweets are automatically deleted as well
 * When a user is deleted, the users he follows should have one less follower
 *
 * @param {*} req: In body pass through (user_id)
 * @param {*} res: Return error code as per API's document
 */
const deleteUser = async (req, res) => {
  let response = formatResponse(AUTHENTICATION.USER_DELETE_SUCCESS, []);
  try {
    let { user_id } = req.body;
    const existingUser = await User.findOne({ user_id: user_id });
    if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.NOT_FOUND);
      response.message = AUTHENTICATION.USER_NOT_FOUND;
    } else {
      await Tweet.deleteMany({ created_by: user_id });
      await User.deleteOne({ user_id: user_id });
      res.status(HTTP_STATUS.OK);
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
  getTweetsForUser,
  deleteUser,
};

module.exports = UserController;
