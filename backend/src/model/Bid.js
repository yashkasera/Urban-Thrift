const mongoose = require("mongoose");

const bid_schema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
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

bid_schema.index({ product_id: 1, user_id: 1 });

const bid_model = mongoose.model("bid", bid_schema);

module.exports = bid_model;
