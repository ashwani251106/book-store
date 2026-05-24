const express = require("express")
const isAuth = require("../middlewares/isAuth")
const viewBook = require("../controllers/viewBook")
const updateBookDetails = require("../controllers/updateBookcontroller")
const { cacheViewBook } = require("../middlewares/cacheBookMiddleware")

const viewBookRoute = express.Router()
viewBookRoute.get("/viewBook/:bookId",isAuth,cacheViewBook,viewBook)
viewBookRoute.patch("/updateDetails/:bookId",isAuth,updateBookDetails)
module.exports = viewBookRoute