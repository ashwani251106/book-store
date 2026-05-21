const generateReviews = require("../controllers/generateReview");
const express = require("express");
const isAuth = require("../middlewares/isAuth");
const getReviews = require("../controllers/getReviews");


const reviewRouter = express.Router()
reviewRouter.post("/generateReviews",isAuth,generateReviews)
reviewRouter.get("/getReviews/:bookId",isAuth,getReviews)
module.exports = reviewRouter