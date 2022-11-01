const mongoose = require("mongoose");
const user_bid_schema = new mongoose.Schema(
  {
    user_bid_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    bid_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const user_bid_model = mongoose.model("user_bid", user_bid_schema);

module.exports = user_bid_model;
