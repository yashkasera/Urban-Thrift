require('dotenv').config();
const express = require('express');
const {NotFoundError} = require("./util/error");
const router = require("./routes");
const errorController = require("./controller/errorController");
const app = express();
app.use(express.json());

app.use('/api/v1', router);

app.all('*', (req, res) => {
    errorController(new NotFoundError(), req, res);
});

module.exports = app;