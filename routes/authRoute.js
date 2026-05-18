const express = require("express")
const {register,refershIt, login, logout, logoutAll,verifyEmail} = require("../controllers/authController")

const authRouter = express.Router()
authRouter.post("/register",register);
authRouter.get("/refresh",refershIt)
authRouter.post("/login",login);
authRouter.get("/logout",logout);
authRouter.get("/logoutAll",logoutAll);
authRouter.post("/verify-email",verifyEmail)
module.exports = authRouter;