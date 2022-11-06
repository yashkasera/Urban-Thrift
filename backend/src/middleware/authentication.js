const jwt = require("jsonwebtoken");
const errorController = require("../controller/errorController");
const userModel = require("../model/User");
const { AuthenticationError } = require("../util/error");
const authFunction = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "IWP_PROJECT");
    console.log(token, decoded);
    const user = await userModel.findOne({
      _id: decoded._id,
      token,
    });

    if (!user) {
      throw new AuthenticationError();
    }

    req.user = user;
    req.token = token;
    next();
  } catch (e) {
    console.log(e);
    errorController(new AuthenticationError(), req, res);
  }
};

module.exports = authFunction;
