const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");

const product_model = require("../model/Product");
const user_product_model = require("../model/User_Product");
const { BadRequestError, NotFoundError } = require("../util/error");
const agenda = require("./agenda");
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
    const { size, color, category, page } = req.query;
    if (!page) {
      throw new Error();
    }
    let result = [];
    if (!size && !color && !category) {
      result = await product_model
        .find() //({ end_time: { $gte: Date.now() } })
        .populate("added_by")
        .populate("highest_bid_id");
      console.log(result);
    } else {
      const queryArray = [];
      if (size) queryArray.push({ size });
      if (color) queryArray.push({ color });
      if (category) queryArray.push({ category });
      // console.log(queryArray);
      result = await product_model
        .find({
          $and: queryArray,
        })
        .populate("added_by")
        .populate("highest_bid_id");
    }
    console.log(result);
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
    agenda.schedule("in 1 minute", "prod", { id: product._id });
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
      .populate("highest_bid_id");
    return res.status(200).send(products);
  } catch (e) {
    console.log(e);
    errorController(e);
  }
});

// router.put("/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     if (!id) throw new Error();
//     let product = await product_model.findById(id);
//     if (!product) throw new NotFoundError();
//     else if (product.added_by != req.user._id) throw new ForbiddenError();
//     else {
//       delete req.body._id;
//       product = {
//         ...product,
//         ...req.body,
//       };
//       await product.save();
//       return res.status(200).send(product);
//     }
//   } catch (e) {
//     errorController(e, req, res);
//   }
// });

module.exports = router;
