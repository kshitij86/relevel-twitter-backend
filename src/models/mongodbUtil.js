const mongoose = require("mongoose");

const { MONGO_URL } = require("../config/config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(MONGO_URL).then(() => {
      console.log("connected to mongodb successfully");
    });
  } catch (err) {
    console.error(err);
  }
};

module.exports = { mongoConnect: mongoConnect };
