const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { NotFoundError, AuthenticationError } = require("../util/error");

const user_schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    token: {
      type: String,
    },
    address: {
      addressLineOne: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: { type: String, required: true },
      pincode: {
        type: String,
        required: true,
      },
    },
    wallet: {
      type: Number,
      // required: true,
    },
  },
  { timestamps: true }
);

user_schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.token;

  return userObject;
};

user_schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "IWP_PROJECT");
  user.token = token;
  await user.save();
  return token;
};

user_schema.statics.findByCredentials = async (email, password) => {
  const user = await user_model.findOne({ email });

  if (!user) {
    throw new NotFoundError();
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AuthenticationError();
  }
  return user;
};

user_schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const user_model = mongoose.model("User", user_schema);
module.exports = user_model;
