const { Router } = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const bid_model = require("../model/Bid");
const product_model = require("../model/Product");
const { NotFoundError, ForbiddenError } = require("../util/error");
const router = new Router();

const sorter = (a, b) => {
  return b.max_amount - a.max_amount;
};

router.use(authFunction);
router.post("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    if (!product_id) throw new Error();
    const product = await product_model.findById(product_id);
    if (!product) throw new NotFoundError();
    if (product.added_by.toString() == req.user._id) throw new ForbiddenError();
    const bids = await bid_model.find({ product_id }).sort({ _id: -1 });
    if (!bids || bids.length == 0) {
      const bid = new bid_model({
        ...req.body,
        user_id: req.user._id,
        product_id,
        amount: product.min_bid,
        current_amount: product.min_bid,
      });
      product["highest_bid_id"] = bid._id;
      await product.save();
      await bid.save();
      return res.status(201).send(bid);
    } else {
      //todo mail all users whose bid is obsolete
      const bid = new bid_model({
        ...req.body,
        user_id: req.user._id,
        product_id,
        amount: product.min_bid,
        current_amount: product.min_bid,
      });

      bids.push(bid);
      bids.sort(sorter);
      const largest = bids[0];
      const sLargest = bids[1];
      largest.current_amount =
        sLargest.max_amount + product.increment_amount <= largest.max_amount
          ? sLargest.max_amount + product.increment_amount
          : largest.max_amount;
      await largest.save();
      bids.map(async (b) => {
        if (b._id != largest._id) {
          b.current_amount = b.max_amount;
          await b.save();
        }
      });
      product["highest_bid_id"] = largest._id;
      await product.save();
      if (largest.user_id != req.user._id) {
        return res.status(201).send({
          message: "Bid created but not highest!",
          largest: largest.current_amount,
        });
      } else {
        return res.status(201).send({
          message: "Bid created!",
          bid: largest,
        });
      }
    }
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.patch("/:product_id", async (req, res) => {
  try {
    const { product_id } = req.params;
    const bid = await bid_model.findOne({
      user_id: req.user._id,
      product_id,
    });
    const product = await product_model.findById(product_id);
    if (!bid) throw new NotFoundError();
    if (!req.body.max_amount) throw new Error();
    bid.max_amount = req.body.max_amount;
    await bid.save();
    const bids = await bid_model.find({ _id: { $ne: bid._id } });
    bids.push(bid);
    bids.sort(sorter);
    const largest = bids[0];
    const sLargest = bids[1];
    largest.current_amount =
      sLargest.max_amount + product.increment_amount <= largest.max_amount
        ? sLargest.max_amount + product.increment_amount
        : largest.max_amount;
    await largest.save();
    bids.map(async (b) => {
      if (b._id != largest._id) {
        b.current_amount = b.max_amount;
        await b.save();
      }
    });
    product["highest_bid_id"] = largest._id;
    await product.save();
    if (largest.user_id != req.user._id) {
      return res.status(201).send({
        message: "Bid created but not highest!",
        largest: largest.current_amount,
      });
    } else {
      return res.status(201).send({
        message: "Bid created!",
        bid: largest,
      });
    }
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

router.get("/all", async (req, res) => {
  try {
    const bids = await bid_model
      .find({ user_id: req.user._id }) // end_time:{$gt:new Date(Date.now())}
      .populate("user_id")
      .populate({
        path: "product_id",
        populate: [
          {
            path: "highest_bid_id",
          },
        ],
      })
      .sort({ _id: -1 });
    return res.status(200).send(bids);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

module.exports = router;
