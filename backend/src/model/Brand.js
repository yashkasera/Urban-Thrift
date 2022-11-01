const mongoose = require("mongoose");

const brand_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ranking: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const brand_model = mongoose.model("brand", brand_schema);

module.exports = brand_model;
