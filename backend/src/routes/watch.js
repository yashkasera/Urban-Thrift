const { Router } = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const user_product_model = require("../model/User_Product");
const router = new Router();

router.use(authFunction);

router.post("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id || !req.user._id) throw new Error();
    const user_product = new user_product_model({
      product_id,
      user_id: req.user._id,
    });
    await user_product.save();
    return res.status(200).send(user_product);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});
