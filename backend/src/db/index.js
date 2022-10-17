const mongoose = require("mongoose");
const bid_model = require("../model/Bid");
const product_model = require("../model/Product");
const user_model = require("../model/User");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    const models = [user_model, product_model, bid_model];
    await Promise.all(
      models.map(async (model) => {
        await model.init();
      })
    );
    //init models
    console.log("Connected to db");
    console.log(process.env.JWT_KEY);
  })
  .catch((e) => {
    console.log(`Error has occured, ${e.message}`);
  });
