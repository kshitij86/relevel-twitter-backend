const { isEmpty } = require("lodash");
const { User } = require("../models");
const { formatResponse, checkIfValid } = require("../common/helpers/util");
const { HTTP_STATUS, TWEET, COMMON } = require("../common/helpers/constants");
const Tweet = require("../models/Tweet");

const tweet = async (req, res) => {
  //create a tweet
  let response = formatResponse(TWEET.TWEET_SUCCESS, []);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.EMPTY_PARAMETERS;
    } else {
      let { user_id, tweet_body } = req.body;
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
        res.status(HTTP_STATUS.OK);
        response.message = TWEET.TWEET_SUCCESS;
      }
    }
  } catch (err) {
    res.status(HTTP_STATUS.SERVER_ERROR);
    response.message = COMMON.ACTION_FAILURE;
    console.error(err);
  }
  res.send(response);
};

const deleteTweet = (req, res) => {
  //deleteTweet api logic here
};

const likeTweet = async (req, res) => {
  //likeTweet api logic here
  let response = formatResponse(TWEET.LIKE_TWEET_SUCCESS);
  try {
    if (!checkIfValid(req.body)) {
      res.status(HTTP_STATUS.BAD_REQUEST);
      response.message = COMMON.EMPTY_PARAMETERS;
    } else {
      let { tweet_id, user_id } = req.body;
      const exisitingUser = User.findOne({ user_id: user_id });
      const existingTweet = Tweet.findOne({ tweet_id });
      if (!isEmpty(exisitingUser) && !isEmpty(existingTweet)) {
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
