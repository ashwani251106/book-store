const {generateReviews , deleteReviews} = require("../controllers/generateReview");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const getReviews = require("../controllers/getReviews");


const reviewRouter = express.Router()
reviewRouter.post("/generateReviews",isAuth,generateReviews)
reviewRouter.get("/getReviews/:bookId",isAuth,getReviews)
reviewRouter.delete("/deleteReview/:reviewId",isAuth,deleteReviews)
module.exports = reviewRouter