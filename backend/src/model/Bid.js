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
  },
  {
    timestamps: true,
  }
);

bid_schema.index({ product_id: 1, user_id: 1 }, { unique: true });

const sorter = (a, b) => {
  return b.current_amount - a.current_amount;
};

// bid_schema.pre("save", async function (next) {
//   const bid = this;
//   const user = await user_model.findById(bid.user_id);
//   const product = await product_model.findById(bid.product_id);
//   const bids = await bid_model.find({
//     product_id: bid.product_id,
//     _id: { $ne: bid._id },
//   });
//   bids.push(bid);
//   bids.sort(sorter);
//   product.highest_bid_id = bids[0]._id;

//   await product.save();

//   const user_bids = await bid_model.find({
//     user_id: bid.user_id,
//     _id: { $ne: bid._id },
//   });
//   user_bids.push(bid);
//   const product_ids = user_bids.map((b) => b.product_id);
//   const orders = await order_model.find({ product_id: { $in: product_ids } });
//   const order_product_ids = orders.map((o) => o.product_id);
//   const considerable_products = product_ids.filter(
//     (pid) => !order_product_ids.includes(pid)
//   );
//   const my_final_bids = await bid_model({
//     user_id: bid.user_id,
//     product_id: { $in: considerable_products },
//   });
//   let sum = 0;
//   my_final_bids.forEach((bid) => {
//     sum += bid.current_amount;
//   });
//   if (sum > user.wallet) {
//     throw new Error();
//   }
//   next();
// });

const bid_model = mongoose.model("bid", bid_schema);

module.exports = bid_model;
