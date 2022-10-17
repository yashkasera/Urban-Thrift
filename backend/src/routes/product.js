const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");

const product_model = require("../model/Product");
const { BadRequestError } = require("../util/error");

const router = express.Router();

router.post("/add", authFunction, async (req, res) => {
  try {
    const product = new product_model({ ...req.body, added_by: req.user._id });
    return res.send(product);
  } catch (e) {
    console.log(e);
    return errorController(new BadRequestError(), req, res);
  }
});

module.exports = router;
