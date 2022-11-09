const product_model = require("../model/Product");
const products = require("./products.json");
(async () => {
  await Promise.all(
    products.map(async (p) => {
      const product = new product_model(p);
      await product.save();
    })
  );
})();
