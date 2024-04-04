const sql = require("mssql/msnodesqlv8");

var config = {
  driver: "msnodesqlv8",
  connectionString:
    "Driver={ODBC Driver 17 for SQL Server};Server={DE};Database={SupplyLink};Trusted_Connection={yes};",
};

const connectDatabase = () => {
  return sql
    .connect(config)
    .then((pool) => {
      console.log("Database Connected to MSSQL");
      return pool;
    })
    .catch((err) => console.log("Database Connection Failed! Bad Config: "));
};

module.exports = connectDatabase;
