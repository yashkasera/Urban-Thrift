const express = require("express");
const errorController = require("../controller/errorController");
const user_model = require("../model/User");

const router = new express.Router();

const { BadRequestError, AuthenticationError } = require("../util/error");

//route for sign up
router.post("/signup", async (req, res) => {
  try {
    const user = new user_model(req.body);
    const token = await user.generateAuthToken();
    return res.send("hi");
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
    console.log(token);
    res.send("Hi");
  } catch (e) {
    console.log(e);
    errorController(new AuthenticationError(), req, res);
  }
});

//route for logout
//?
// router.post("/logout", authFunction, async (req, res) => {
//   try {
//     req.user.token = undefined;
//     await req.user.save();
//     const success = new UserLoggedOutSuccess();
//     successHandler(success, res);
//   } catch (e) {
//     errorController(new BadRequestError(), req, res);
//   }
// });

module.exports = router;
