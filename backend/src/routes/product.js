const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");

const product_model = require("../model/Product");
const { BadRequestError } = require("../util/error");

const router = express.Router();

router.get("/latest", async (req, res) => {
  try {
    const latest = await product_model.find().sort({ _id: -1 }).limit(5);
    console.log(latest);
    return res.send(latest);
  } catch (e) {
    console.log(e);
    errorController(new BadRequestError(), req, res);
  }
});

router.use(authFunction);

router.post("/add", async (req, res) => {
  try {
    const product = new product_model({ ...req.body, added_by: req.user._id });
    await product.save();
    return res.send(product);
  } catch (e) {
    console.log(e);
    return errorController(new BadRequestError(), req, res);
  }
});

module.exports = router;
