const { config } = require("dotenv");

config();

module.exports = {
  MONGO_URL: process.env.MONGO_URL,
  SERVER_PORT: process.env.SERVER_PORT,
  NODE_ENV: process.env.NODE_ENV,
};
