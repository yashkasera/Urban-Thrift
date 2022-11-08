const product_model = require("../model/Product");
// const bid_model = require("../model/Bid");

// const sorter = (a, b) => {
//   return b.current_amount - a.current_amount;
// };

(async () => {
  const products = await product_model.find();
  await Promise.all(
    products.map(async (p) => {
      p.end_time = Date.now() + 5 * 60 * 1000;
      await p.save();
    })
  );
  console.log("done");
})();
