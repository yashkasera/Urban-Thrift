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
  },
  {
    name: "Yash",
    password: commonPassword,
    phone: "9090909090",
    email: "Yash@gmail.com",
    address: commonAddress,
  },
  {
    name: "Hrishita",
    password: commonPassword,
    phone: "8989898989",
    email: "Hrishita@gmail.com",
    address: commonAddress,
  },
  {
    name: "Sanjitha",
    password: commonPassword,
    phone: "8787878787",
    email: "Sanjitha@gmail.com",
    address: commonAddress,
  },
  {
    name: "Rujula",
    password: commonPassword,
    phone: "7979797979",
    email: "Rujula@gmail.com",
    address: commonAddress,
  },
];

const usersss = require("./products.json");
(async () => {
  const p = await product_model.find();
  console.log(p.length);
  // p.forEach((pp) => pp.remove());
  //   usersss.map(async (user) => {
  //     if (!user.brand) console.log(user);
  //     const m_user = new product_model(user);
  //     await m_user.save();
})();
