const express = require("express")
const isAuth = require("../middlewares/isAuth")
const profile = require("../controllers/profileController")
const profileRouter = express.Router()

profileRouter.get("/profile",isAuth,profile);
module.exports = profileRouter
