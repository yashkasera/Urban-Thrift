require("dotenv").config();
const mongoose = require("mongoose");
const models = require("../model");
const MONGO_URI = process.env.MONGO_URI;
// ||
// "mongodb+srv://deep:abcd1234@urbanthrift.b5zyb6o.mongodb.net/IWP_PROJECT";
mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await Promise.all(
      models.map(async (model) => {
        await model.init();
      })
    );
    require("../routes/agenda");
  })
  .catch((e) => {
    console.log(`Error has occured, ${e.message}`);
  });
