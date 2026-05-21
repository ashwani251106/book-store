const express = require("express")
const isAuth = require("../middlewares/isAuth")
const viewBook = require("../controllers/viewBook")
const viewBookRoute = express.Router()
viewBookRoute.get("/viewBook/:bookId",isAuth,viewBook)
module.exports = viewBookRoute