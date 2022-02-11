require("dotenv").config();
const util = require("util");
const encoder = new util.TextEncoder("utf-8");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { SERVER_PORT, NODE_ENV } = require("./config/config");
const { mongoConnect } = require("./models/mongodbUtil");

const app = express();

app.use(express.json());
app.use(cors());

// problematic part
// app.use("/", (req, res) => {
//   res.send({
//     message: "Welcome to Relevel Twitter clone. Try /api for more info.",
//   });
// });
mongoConnect();

app.use("/api", routes);

app.listen(SERVER_PORT, (err) => {
  if (err) {
    console.error(err);
  }
  console.log(`server started in ${NODE_ENV} mode at port ${SERVER_PORT}`);
});
