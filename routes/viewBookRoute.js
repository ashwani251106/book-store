const express = require("express")
const isAuth = require("../middlewares/isAuth")
const viewBook = require("../controllers/viewBook")
const updateBookDetails = require("../controllers/updateBookcontroller")

const viewBookRoute = express.Router()
viewBookRoute.get("/viewBook/:bookId",isAuth,viewBook)
viewBookRoute.post("/updateDetails",isAuth,updateBookDetails)
module.exports = viewBookRoute