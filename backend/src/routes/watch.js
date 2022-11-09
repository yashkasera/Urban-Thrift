const { Router } = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const product_model = require("../model/Product");
const user_product_model = require("../model/User_Product");
const { NotFoundError } = require("../util/error");
const router = new Router();

router.use(authFunction);

router.post("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id || !req.user._id) throw new Error();
    const up = await user_product_model.findOne({
      product_id,
      user_id: req.user._id,
    });
    if (up) {
      return res.status(203).send(up);
    }
    const user_product = new user_product_model({
      product_id,
      user_id: req.user._id,
    });
    await user_product.save();
    return res.status(201).send(user_product);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.get("/", async (req, res) => {
  try {
    const watches = await user_product_model
      .find({ user_id: req.user._id })
      .sort({ _id: -1 });
    const ids = watches.map((w) => w.product_id);
    // console.log(ids);
    const products = await product_model
      .find({ _id: { $in: ids } })
      .populate("added_by")
      .populate("highest_bid_id")
      .sort({ _id: -1 });
    // console.log(products);
    return res.status(200).send(products);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.post("/delete/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const { _id } = req.user;
    const watcher = await user_product_model.findOne({
      user_id: _id,
      product_id,
    });
    if (!watcher) throw new NotFoundError();
    await watcher.remove();
    return res.status(200).send(watcher);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});
module.exports = router;
