const mongoose = require("mongoose");
const order_enum = ["placed", "failed", "cancelled"];
const order_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
      unique: true,
    },
    status: {
      type: String,
      default: "placed",
    },
  },
  {
    timestamps: true,
  }
);

const order_model = mongoose.model("order", order_schema);

module.exports = order_model;
