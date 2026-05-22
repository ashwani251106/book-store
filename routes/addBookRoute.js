const express = require("express")
const isAuth = require("../middlewares/isAuth")
const {addBookController,getBookByUser} = require("../controllers/addBookController")

const addBookRouter = express.Router()
addBookRouter.post("/addBook",isAuth,addBookController),
addBookRouter.get("/getBookByUser",isAuth,getBookByUser)
module.exports = addBookRouter