const mongoose = require("mongoose");
const size_enum = ["XXS", "XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const product_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    condition: {
      type: Number,
      default: 5,
    },
    size: {
      type: String,
      enum: size_enum,
      required: true,
    },
    // category:{},
    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    min_bid: {
      type: Number,
      required: true,
    },
    increment_amount: {
      type: Number,
      required: true,
    },
    start_time: {
      type: Date,
      default: new Date(Date.now()),
    },
    end_time: {
      type: Date,
      default: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
  },
  { timestamps: true }
);

const product_model = mongoose.model("Product", product_schema);
module.exports = product_model;
