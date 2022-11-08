const Agenda = require("agenda");
const order_model = require("../model/Order");
const product_model = require("../model/Product");
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
    agenda.schedule("in 2 minutes", "prod", { id: product._id });
    await product.save();
    console.log("27:", product);
  } else {
    const order = new order_model({
      user_id: product.highest_bid_id.user_id,
      product_id: product._id,
    });
    await order.save();
    console.log("34:", order);
  }
};

agenda.define("log", fn);
agenda.define("prod", product_agenda);
(async () => {
  await agenda.start();
})();

module.exports = agenda;
