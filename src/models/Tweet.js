// User Model
const { v4 } = require("uuid");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema({
  tweet_id: {
    type: String,
    required: true,
    default: v4(),
  },
  tweet_body: {
    type: String,
    required: true,
  },
  date_created: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  created_by: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    required: true,
    default: 0,
  },
});

module.exports = mongoose.model("Tweet", tweetSchema);
