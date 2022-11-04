const mongoose = require("mongoose");
const bid_model = require("./Bid");

const category_enum = [
  "Topwear",
  "Bottomwear",
  "Footwear",
  "Accessories",
  "Dresses",
  "Overalls",
  "Innerwear",
];

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
    },
    product_condition: {
      type: Number,
      default: 3,
    },
    size: {
      type: String,
    },
    size_description: String,

    category: {
      type: String,
      enum: category_enum,
      required: true,
    },
    image: [
      {
        type: String,
      },
    ],
    keywords: [
      {
        type: String,
      },
    ],
    material: String,

    added_by: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
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
    color: String,
    watchers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);
// const sorter = (a, b) => {
//   return b.current_amount - a.current_amount;
// };
// product_schema.methods.toJSON = function () {
//   const product = this;

//   const productObject = product.toObject();

//   bid_model.find({ product_id: productObject._id }).then((bids) => {
//     bids.sort(sorter);
//     productObject.highest_bid = bids[0].current_amount;
//     console.log(productObject);
//     return productObject;
//   });
// };

const product_model = mongoose.model("Product", product_schema);
module.exports = product_model;
