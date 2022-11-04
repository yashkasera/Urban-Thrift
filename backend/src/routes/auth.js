const express = require("express");
const errorController = require("../controller/errorController");
const authFunction = require("../middleware/authentication");
const user_model = require("../model/User");

const router = new express.Router();

//route for sign up
router.post("/signup", async (req, res) => {
  try {
    const user = new user_model(req.body);
    const token = await user.generateAuthToken();
    return res.send({ ...user, token });
  } catch (e) {
    console.log(e);
    errorController(e, req, res);
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
    errorController(e, req, res);
  }
});

router.use(authFunction);

router.post("/logout", async (req, res) => {
  try {
    req.user.token = undefined;
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    errorController(e, req, res);
  }
});

router.put("/", async (req, res) => {
  try {
    delete req.body._id;
    delete req.body.token;
    req.user = {
      ...req.user,
      ...req.body,
    };
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    errorController(e, req, res);
  }
});

module.exports = router;
