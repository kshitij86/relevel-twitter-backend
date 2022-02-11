// User Model
const { v4 } = require("uuid");
const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  user_id: {
    type: String,
    required: true,
    default: v4(),
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date_registered: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  followers_count: {
    type: Number,
    required: true,
    default: 0,
  },
  tweets_count: {
    type: Number,
    required: true,
    default: 0,
  },
  followers: {
    type: Array,
    required: true,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
