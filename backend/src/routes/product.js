const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");

const product_model = require("../model/Product");
const {
  BadRequestError,
  NotFoundError,
  ForbiddenError,
} = require("../util/error");

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

router.post("/", async (req, res) => {
  try {
    const product = new product_model({ ...req.body, added_by: req.user._id });
    await product.save();
    return res.send(product);
  } catch (e) {
    console.log(e);
    return errorController(e, req, res);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error();
    let product = await product_model.findById(id);
    if (!product) throw new NotFoundError();
    else if (product.added_by != req.user._id) throw new ForbiddenError();
    else {
      delete req.body._id;
      product = {
        ...product,
        ...req.body,
      };
      await product.save();
      return res.status(200).send(product);
    }
  } catch (e) {
    errorController(e, req, res);
  }
});

module.exports = router;
