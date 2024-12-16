const mongoose = require("mongoose");
const dbConnection = () => {
  mongoose
    .connect(process.env.DBKEY)
    .then(() => {
      console.log("Database Connected!");
    })
    .catch((e) => {
      console.log("Error while connecting to database", e);
    });
};

module.exports = dbConnection;
