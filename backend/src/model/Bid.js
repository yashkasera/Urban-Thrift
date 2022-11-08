const mongoose = require("mongoose");

const bid_schema = new mongoose.Schema(
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
    },
    max_amount: Number,
    current_amount: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bid_schema.index({ product_id: 1, user_id: 1 }, { unique: true });

const bid_model = mongoose.model("bid", bid_schema);

module.exports = bid_model;
