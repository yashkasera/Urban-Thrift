const mongoose = require("mongoose");
const models = require("../model");
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    await Promise.all(
      models.map(async (model) => {
        await model.init();
      })
    );
    // require("../util/addData");

    // require("../util/updateProd");
    console.log("Connected to db");
    console.log(process.env.JWT_KEY);
  })
  .catch((e) => {
    console.log(`Error has occured, ${e.message}`);
  });
