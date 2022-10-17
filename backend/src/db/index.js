const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    //init models
    console.log("Connected to db");
    console.log(process.env.JWT_KEY);
  })
  .catch((e) => {
    console.log(`Error has occured, ${e.message}`);
  });
