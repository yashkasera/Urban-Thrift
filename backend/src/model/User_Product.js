const mongoose = require("mongoose");

const user_product_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

user_product_schema.index({ user_id: 1, product_id: 1 });

const user_product_model = new mongoose.model(
  "User_Product",
  user_product_schema
);
module.exports = user_product_model;
