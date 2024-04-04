const app = require("./app");
const dotenv = require("dotenv");
const connectDatabase = require("./config/database");
const createTables = require("./models/createTables");

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

//Config
console.log(process.env.PORT);

// Connecting to database
createTables();

//Server Listening
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on :/${process.env.PORT}`);
});

// Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);
  server.close(() => {
    process.exit(1);
  });
});
