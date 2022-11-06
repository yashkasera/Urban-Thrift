const product_model = require("../model/Product");
const bid_model = require("../model/Bid");

const sorter = (a, b) => {
  return b.current_amount - a.current_amount;
};

async () => {
  const products = await product_model.find();
  await Promise.all(
    products.map(async (p) => {
      const bids = await bid_model.find({ product_id: p._id });
      if (bids.length > 0) {
        bids.sort(sorter);
        p.highest_bid_id = bids[0]._id;
        await p.save();
        console.log(p);
      }
    })
  );
  console.log("done");
};
