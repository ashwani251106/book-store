const express = require("express")
const isAuth = require("../middlewares/isAuth")
const getChatController = require("../controllers/getChatController")
const chatController = require("../controllers/chatController")

const chatRouter = express.Router()

chatRouter.post("/chat",isAuth,chatController)
chatRouter.get("/chat/:chatId",isAuth,getChatController)

module.exports = chatRouter