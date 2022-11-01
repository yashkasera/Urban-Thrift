const mongoose = require("mongoose");
const order_product_schema = new mongoose.Schema(
  {
    order_product_id: {
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

const order_product_model = mongoose.model(
  "order_product",
  order_product_schema
);

module.exports = order_product_model;
