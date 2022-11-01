const mongoose = require("mongoose");
const user_order_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    order_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const user_order_model = mongoose.model("user_order", user_order_schema);

module.exports = user_order_model;
