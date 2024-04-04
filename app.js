const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
var cors = require("cors");
const errorMiddleware = require("./middleware/error");

// Config
dotenv.config({ path: "./config/config.env" });

// Middleware
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

//JSON REQUEST HANDELER Middleware
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

// Route Imports
// app.use("/api/v1/");

app.use(errorMiddleware);
module.exports = app;
