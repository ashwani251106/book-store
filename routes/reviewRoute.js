const {generateReviews , deleteReviews} = require("../controllers/generateReview");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const {getReviews,getReviewsByUser} = require("../controllers/getReviews");
const { cacheReviewOfABook } = require("../middlewares/cacheReviewsMiddleWare");


const reviewRouter = express.Router()
reviewRouter.post("/generateReviews/:bookId",isAuth,generateReviews)
reviewRouter.get("/getReviews/:bookId",isAuth,cacheReviewOfABook,getReviews)
reviewRouter.delete("/deleteReview/:reviewId/:bookId",isAuth,deleteReviews)
reviewRouter.get("/reviewByUser",isAuth,getReviewsByUser)
module.exports = reviewRouter