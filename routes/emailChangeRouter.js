const express = require("express")
const isAuth = require("../middlewares/isAuth")
const {requestEmailChange,verifyEmailChange} = require("../controllers/EmailChange")

const changeEmailRouter = express.Router()

changeEmailRouter.post("/user/request-email-change",isAuth,requestEmailChange)
changeEmailRouter.post("/user/verify-email",isAuth,verifyEmailChange)

module.exports = changeEmailRouter