const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const user_model = require("../model/User");

const router = new express.Router();

const { BadRequestError, AuthenticationError } = require("../util/error");

//route for sign up
router.post("/signup", async (req, res) => {
  try {
    const user = new user_model(req.body);
    const token = await user.generateAuthToken();
    return res.send(true);
  } catch (e) {
    console.log(e);
    errorController(new BadRequestError(), req, res);
  }
});

//route for login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await user_model.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).send({ ...user, token });
  } catch (e) {
    if (e.name && e.message && e.code) {
      errorController(e, req, res);
    }
    errorController(new BadRequestError(), req, res);
  }
});

router.use(authFunction);

router.post("/logout", async (req, res) => {
  try {
    req.user.token = undefined;
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    errorController(new BadRequestError(), req, res);
  }
});

module.exports = router;
