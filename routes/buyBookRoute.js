const {createOrderAndReserveStock,verifyPaymentAndFinalize} = require("../controllers/buyBookController")
const express = require("express");
const isAuth = require("../middlewares/isAuth");

const buyBookRouter = express.Router()
buyBookRouter.post("/buyBook",isAuth,createOrderAndReserveStock)
buyBookRouter.post("/verifyPayment",isAuth,verifyPaymentAndFinalize)
module.exports = buyBookRouter
