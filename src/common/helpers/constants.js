module.exports = {
  AUTHENTICATION: {
    REGISTER_SUCCESS: "User has been registered successfully",
    REGISTER_FAILURE: "User could not be registered",
    EXISTING_USER: "User is already registered",
    LOGIN_SUCCESS: "User has been logged in successfully",
    LOGIN_FAILURE: "User could not be logged in",
  },
  TWEET: {
    TWEET_SUCCESS: "That tweet was tweeted successfully",
    TWEET_FAILURE: "Coul not tweet that",
    TWEET_USER_NOT_FOUND:
      "That user could not be found. Please register and try again",
    LIKE_TWEET_SUCCESS: "Liked that tweet successfully",
    LIKE_TWEET_FAILURE: "Could not like that tweet",
    TWEET_FETCH_SUCCESS: "Fetched tweets for that user",
    TWEET_FETCH_FAILURE: "Could not fetch tweets",
    INVAVLID_TWEET_REQUEST: "Invalid user or tweet",
  },
  HTTP_STATUS: {
    OK: 200,
    RESOURCE_CREATED: 201,
    NOT_FOUND: 404,
    BAD_REQUEST: 400,
    AUTH_FAILURE: 401,
    SERVER_ERROR: 500,
    ALREADY_EXISTS: 403,
  },
  COMMON: {
    ACTION_SUCCESS: "Performed that action successfully",
    ACTION_FAILURE: "That action cannot be performed right now",
    INVALID_REQUEST: "The request parameters are invalid",
    EMPTY_PARAMETERS: "Empty payload, could not complete request",
  },
};
