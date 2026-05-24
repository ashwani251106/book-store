const express = require("express")
const isAuth = require("../middlewares/isAuth")
const {addBookController,getBookByUser, getAllOriginalBook, getAllUsedBook} = require("../controllers/addBookController")
const {cacheBookByUser, cacheOriginalBooks, cacheUsedBooks} = require("../middlewares/cacheBookMiddleware")

const addBookRouter = express.Router()
addBookRouter.post("/addBook",isAuth,addBookController),
addBookRouter.get("/getBookByUser",isAuth,cacheBookByUser,getBookByUser)
addBookRouter.get("/getUsedBooks",isAuth,cacheUsedBooks,getAllUsedBook)
addBookRouter.get("/getOriginalBooks",isAuth,cacheOriginalBooks,getAllOriginalBook)
module.exports = addBookRouter