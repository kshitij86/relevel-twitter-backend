const { isEmpty } = require("lodash");
const { User } = require("../models");
const { formatResponse, checkIfValid } = require("../common/helpers/util");
const { HTTP_STATUS, TWEET, COMMON } = require("../common/helpers/constants");
const Tweet = require("../models/Tweet");

/**
 * Create a new tweet and update a user's tweet count
 *
 * @param {*} req: In body pass through (username, tweet_body, user_id)
 * @param {*} res: Return error code as per API's document
 */

const tweet = async (req, res) => {
  //create a tweet
  let response = formatResponse(TWEET.TWEET_SUCCESS, []);
  try {
    let { username, tweet_body, user_id } = req.body;
    const existingUser = await User.findOne({ user_id: user_id });
    if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = TWEET.TWEET_USER_NOT_FOUND;
    } else {
      let newTweet = {
        tweet_body: tweet_body,
        created_by: user_id,
      };

      await Tweet.create(newTweet);
      await User.findOneAndUpdate(
        { user_id: user_id },
        {
          $inc: {
            tweets_count: 1,
          },
        }
      );
      res.status(HTTP_STATUS.OK);
      response.message = TWEET.TWEET_SUCCESS;
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Delete a tweet and update a user's tweet_count
 *
 * @param {*} req: In body pass through (email, password)
 * @param {*} res: Send a session token, or the apt error code
 */

const deleteTweet = async (req, res) => {
  //deleteTweet api logic here
  let response = formatResponse(TWEET.TWEET_DELETE_SUCCESS, []);
  try {
    let { tweet_id, user_id } = req.body;
    const existingTweet = await Tweet.findOne({ tweet_id: tweet_id });
    const existingUser = await User.findOne({ user_id: user_id });
    if (isEmpty(existingTweet)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = TWEET.TWEET_NOT_FOUND;
    } else if (isEmpty(existingUser)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = TWEET.TWEET_USER_NOT_FOUND;
    } else {
      await Tweet.deleteOne({ tweet_id: tweet_id });
      await User.findOneAndUpdate(
        { user_id: user_id },
        {
          $dec: {
            tweets_count: 1,
          },
        }
      );
      res.status(HTTP_STATUS.OK);
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = TWEET.TWEET_DELETE_FAILURE;
    console.error(err);
  }
  res.send(response);
};

/**
 * Like a tweet
 *
 * @param {*} req: In body pass through (tweet_id, user_id)
 * @param {*} res: Return error code as per API's document
 */
const likeTweet = async (req, res) => {
  let response = formatResponse(TWEET.LIKE_TWEET_SUCCESS);
  try {
    let { tweet_id, user_id } = req.body;
    const existingUser = await User.findOne({ user_id: user_id });
    const existingTweet = await Tweet.findOne({ tweet_id: tweet_id });

    if (!isEmpty(existingUser) && !isEmpty(existingTweet)) {
      await Tweet.findOneAndUpdate(
        { tweet_id: tweet_id },
        {
          $inc: { likes: 1 },
        }
      );
      res.status(HTTP_STATUS.OK);
    } else {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = TWEET.INVAVLID_TWEET_REQUEST;
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = TWEET.LIKE_TWEET_FAILURE;
    console.error(err);
  }
  res.send(response);
};

const TweetController = {
  tweet,
  deleteTweet,
  likeTweet,
};

module.exports = TweetController;
