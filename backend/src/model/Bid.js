const mongoose = require("mongoose");

const bid_schema = new mongoose.Schema(
  {
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    max_amount: Number,
    amount: {
      type: Number,
      required: true,
    },
    is_active: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bid_schema.index({ product_id: 1, is_active: 1 });

const bid_model = mongoose.model("bid", bid_schema);

module.exports = bid_model;
