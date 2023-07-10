const route = require("express").Router();
const userRouter = require("./user.router");
route.use("/user", userRouter);

module.exports = route;