const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");

const product_model = require("../model/Product");
const user_product_model = require("../model/User_Product");
const { BadRequestError, NotFoundError } = require("../util/error");
const router = express.Router();

const sorter = (a, b) => {
  return b.watchers - a.watchers;
};

router.get("/home", async (req, res) => {
  try {
    const products = await product_model
      .find()
      .sort({ _id: -1 })
      .populate("added_by")
      .populate("highest_bid_id");

    const viewedP = products.sort(sorter);

    const result = {
      latest: products.slice(0, 8),
      most_watched: viewedP.slice(0, 8),
    };
    // console.log(result.most_watched);
    return res.send(result);
  } catch (e) {
    console.log(e);
    errorController(new BadRequestError(), req, res);
  }
});

router.get("/filter", async (req, res) => {
  try {
    const perPage = 36;
    const { size, color, category, page, brand } = req.query;
    if (!page) {
      throw new Error();
    }
    let result = [];
    if (!size && !color && !category && !brand) {
      result = await product_model
        .find()
        .populate("added_by")
        .populate("highest_bid_id");
    } else {
      const queryArray = [];
      if (size) queryArray.push({ size });
      if (color) queryArray.push({ color });
      if (category) queryArray.push({ category });
      if (brand) queryArray.push({ brand });
      // console.log(queryArray);
      result = await product_model
        .find({
          $and: queryArray,
        })
        .populate("added_by")
        .populate("highest_bid_id")
        .sort({ _id: -1 });
    }
    result = result.slice((page - 1) * perPage, page * perPage);
    return res.send(result);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.get("/latest", async (req, res) => {
  try {
    const result = await product_model
      .find()
      .sort({ _id: -1 })
      .limit(24)
      .populate("added_by")
      .populate("highest_bid_id");
    return res.send(result);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.get("/related", async (req, res) => {
  return res
    .status(200)
    .send(
      await product_model
        .find()
        .limit(4)
        .populate("added_by")
        .populate("highest_bid_id")
        .sort({ _id: -1 })
    );
});

router.get("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    if (!_id) throw new Error();
    const product = await product_model
      .findById(_id)
      .populate("added_by")
      .populate("highest_bid_id");
    if (!product) throw new NotFoundError();
    const related_products = await product_model
      .find({ category: product.category })
      .sort({ _id: -1 })
      .limit(4)
      .populate("added_by")
      .populate("highest_bid_id");

    //?CHECK THIS
    const user_product = await user_product_model.find({ product_id: _id });
    product.watchers = user_product.length;

    return res.status(200).send({ product, related_products });
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.use(authFunction);

router.post("/", async (req, res) => {
  try {
    const product = await new product_model({
      ...req.body,
      added_by: req.user._id,
    });
    await product.save();
    return res.status(201).send(product);
  } catch (e) {
    console.log(e);
    return errorController(e, req, res);
  }
});

router.get("/my/listings", async (req, res) => {
  try {
    const products = await product_model
      .find({ added_by: req.user._id })
      .populate("added_by")
      .populate("highest_bid_id")
      .sort({ _id: -1 });
    return res.status(200).send(products);
  } catch (e) {
    console.log(e);
    errorController(e);
  }
});

module.exports = router;
