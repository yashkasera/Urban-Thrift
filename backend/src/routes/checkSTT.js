const product_model = require("../model/Product");

const x = new Promise(async (resolve, reject) => {
  const data = await product_model.find();
  const successObject = {
    data,
  };

  resolve(successObject);
});

(async () => {
  await new Promise((resolve) => setTimeout(resolve(x), 1000)); // console.log(y);
})();
