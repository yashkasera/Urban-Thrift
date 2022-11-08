require("dotenv").config();

const express = require("express");

const { NotFoundError } = require("./util/error");

const errorController = require("./controller/errorController");

const userRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const bidRouter = require("./routes/bid");
const watchRouter = require("./routes/watch");
const orderRouter = require("./routes/order");
const app = express();
app.use(express.json());

const cors = require("cors");
require("./db");

app.use(cors());
app.use("/api/v1/user", userRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/bid", bidRouter);
app.use("/api/v1/watch", watchRouter);
app.use("/api/v1/order", orderRouter);

app.all("*", (req, res) => {
  errorController(new NotFoundError(), req, res);
});

module.exports = app;
