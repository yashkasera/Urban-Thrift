const mongoose = require("mongoose");
const agenda = require("../routes/agenda");
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
    material: String,
    highest_bid_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "bid",
    },
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
      default: 100,
    },
    start_time: {
      type: Date,
      default: new Date(Date.now()),
    },
    end_time: {
      type: Date,
      default: new Date(Date.now() + 5 * 60 * 1000), //3 * 24 * 60 * 60 * 1000),
    },
    color: String,
    watchers: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const sorter = (a, b) => {
  return b.current_amount - a.current_amount;
};

// product_schema.pre("save", async function (next) {
//   const product = this;

//   const bids = await bid_model.find({ product_id: this._id });
//   if (bids.length > 0) {
//     bids.sort(sorter);
//     product.highest_bid_id = bids[0]._id;
//   }
//   agenda.schedule("in 5 minutes", "prod", { id: product._id });
//   next();
// });
const product_model = mongoose.model("Product", product_schema);
module.exports = product_model;
