const {generateReviews , deleteReviews} = require("../controllers/generateReview");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {getReviews,getReviewsByUser} = require("../controllers/getReviews");


const reviewRouter = express.Router()
reviewRouter.post("/generateReviews/:bookId",isAuth,generateReviews)
reviewRouter.get("/getReviews/:bookId",isAuth,getReviews)
reviewRouter.delete("/deleteReview/:reviewId",isAuth,deleteReviews)
reviewRouter.get("/reviewByUser",isAuth,getReviewsByUser)
module.exports = reviewRouter