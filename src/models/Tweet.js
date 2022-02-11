// User Model
const mongoose = require("mongoose");
const { Schema } = mongoose;

const tweetSchema = new Schema({});

module.exports = mongoose.model("Tweet", tweetSchema);
