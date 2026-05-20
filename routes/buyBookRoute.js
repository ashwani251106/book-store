const buyBook = require("../controllers/buyBookController");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const buyBookRouter = express.Router()
buyBookRouter.post("/buyBook",isAuth,buyBook)
module.exports = buyBookRouter
