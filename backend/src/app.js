require("dotenv").config();

const express = require("express");

const { NotFoundError } = require("./util/error");

const errorController = require("./controller/errorController");

const userRouter = require("./routes/auth");

const app = express();
app.use(express.json());

require("./db");

app.use("/api/v1", userRouter);

app.all("*", (req, res) => {
  errorController(new NotFoundError(), req, res);
});

module.exports = app;
