const mongoose = require("mongoose");

const dbConnect = () => {
  const connectionParams = { useNewUrlParser: true };
  mongoose.connect(process.env.DB, connectionParams);

  mongoose.connection.on("connected", () => {
    console.log("Connected to database sucessfully");
  });

  mongoose.connection.on("error", (err) => {
    console.log("Error while connecting to database:" + err);
  });

  mongoose.connection.on("disconnect", () => {
    console.log("MongoDB connection disconnected");
  });
};

module.exports = dbConnect;
