const mongoose = require("mongoose");
const order_enum = ["placed", "failed", "cancelled"];
const order_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    status: {
      type: String,
      enum: order_enum,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const order_model = mongoose.model("order", order_schema);

module.exports = order_model;
