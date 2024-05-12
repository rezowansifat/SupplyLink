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
const user = require("./routes/userRoute");
const supplier = require("./routes/suppliersRoute");
const product = require("./routes/productRoute");
const order = require("./routes/orderRoute");
const inventory = require("./routes/InventoryRoute");
const featured = require("./routes/featuredRoute");

app.use("/api/v1/", user);
app.use("/api/v1/", supplier);
app.use("/api/v1/", product);
app.use("/api/v1/", order);
app.use("/api/v1/", inventory);
app.use("/api/v1/", featured);

app.use(errorMiddleware);
module.exports = app;
