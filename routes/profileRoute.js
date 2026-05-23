const express = require("express")
const isAuth = require("../middlewares/isAuth")
const {profile,changeProfile} = require("../controllers/profileController");
const { getUnpublishedDrafts } = require("../controllers/writeBookController");
const { cacheUnpublishedBooks } = require("../middlewares/cacheBookMiddleware");
const cacheUserProfile = require("../middlewares/cacheUserMiddleWare");

const profileRouter = express.Router()

profileRouter.get("/profile",isAuth,cacheUserProfile,profile);
profileRouter.patch("/profile/change",isAuth,changeProfile)
profileRouter.get("/profile/unpublished",isAuth,cacheUnpublishedBooks,getUnpublishedDrafts)
module.exports = profileRouter
