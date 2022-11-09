const product_model = require("../model/Product");
const user_model = require("../model/User");

const commonAddress = {
  addressLineOne: "VIT",
  city: "Vellore",
  state: "Tamil Nadu",
  pincode: "632014",
};
const commonPassword = "abcd1234";
const users = [
  {
    name: "Deep",
    password: commonPassword,
    phone: "9191919191",
    email: "deep@gmail.com",
    address: commonAddress,
    wallet: 10000,
  },
  {
    name: "Yash",
    password: commonPassword,
    phone: "9090909090",
    email: "yash@gmail.com",
    address: commonAddress,
    wallet: 10000,
  },
  {
    name: "Hrishita",
    password: commonPassword,
    phone: "8989898989",
    email: "hrishita@gmail.com",
    address: commonAddress,
    wallet: 10000,
  },
  {
    name: "Sanjitha",
    password: commonPassword,
    phone: "8787878787",
    email: "sanjitha@gmail.com",
    address: commonAddress,
    wallet: 10000,
  },
  {
    name: "Rujula",
    password: commonPassword,
    phone: "7979797979",
    email: "rujula@gmail.com",
    address: commonAddress,
    wallet: 10000,
  },
];

const usersss = require("./products.json");
(async () => {
  users.map(async (user) => {
    const m_user = new user_model(user);
    await m_user.save();
  });
  const user_ids = (await user_model.find()).map((user) => user._id);
  console.log(user_ids);
})();
