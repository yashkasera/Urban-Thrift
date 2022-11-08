const { Router } = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const order_model = require("../model/Order");
const router = new Router();

router.use(authFunction);

router.get("/", async (req, res) => {
  try {
    const orders = await await order_model
      .find({ user_id: req.user._id })
      .populate("user_id")
      .populate({
        path: "product_id",
        populate: [
          {
            path: "highest_bid_id",
          },
        ],
      });
    return res.status(200).send(orders);
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
  }
});

module.exports = router;
