const express = require("express")
const isAuth = require("../middlewares/isAuth")
const addBookController = require("../controllers/addBookController")

const addBookRouter = express.Router()
addBookRouter.post("/addBook",isAuth,addBookController)
module.exports = addBookRouter