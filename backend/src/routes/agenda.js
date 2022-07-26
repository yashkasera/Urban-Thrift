const Agenda = require("agenda");
const order_model = require("../model/Order");
const product_model = require("../model/Product");
const user_model = require("../model/User");
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb+srv://deep:abcd1234@urbanthrift.b5zyb6o.mongodb.net/IWP_PROJECT";
console.log("hi:", MONGO_URI);
const agenda = new Agenda({
  db: { address: MONGO_URI, collection: "agenda" },
});

const fn = () => {
  console.log(new Date(Date.now()));
};

const product_agenda = async (job) => {
  console.log(job.attrs.data.id);
  const product = await product_model
    .findById(job.attrs.data.id)
    .populate("added_by")
    .populate("highest_bid_id");
  if (!product.highest_bid_id) {
    product.end_time = Date.now() + 5 * 60 * 1000;
    agenda.schedule("in 5 minutes", "prod", { id: product._id });
    await product.save();
    console.log("27:", product);
  } else {
    const order = new order_model({
      user_id: product.highest_bid_id.user_id,
      product_id: product._id,
    });
    const buyer = await user_model.findById(product.highest_bid_id.user_id);
    const seller = await user_model.findById(product.added_by);
    seller.wallet =
      Number(seller.wallet ? seller.wallet : 0) +
      Number(product.highest_bid_id.current_amount);
    buyer.wallet =
      Number(buyer.wallet) - Number(product.highest_bid_id.current_amount);
    await order.save();
    await buyer.save();
    await seller.save();
    console.log("34:", order, buyer, seller);
  }
};

agenda.define("log", fn);
agenda.define("prod", product_agenda);
(async () => {
  await agenda.start();
})();

module.exports = agenda;
