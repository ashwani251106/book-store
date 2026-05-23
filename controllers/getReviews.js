const Book = require("../models/bookSchema");
const Reviews = require("../models/reviewSchema");
const User = require("../models/userSchema");
// redis me dalne layak hai yeh!
const getReviews = async(req,res)=>{
    const {bookId} = req.params
    try {
        const book = await Book.findById(bookId)
        if(!book){
           return res.status(404).json({
                message:"book not exist in the db!"
            })
        }
        const allReviews = await Reviews.find({_id:{$in: book.review }}).populate("user","name")
        
        const formatReviews = allReviews.map((review)=>{
            return {
                userName:review.user ? review.user.name : "Anonymous",
                content:review.content
            }
        })
        return res.status(200).json({
            success:true,
            reviews:formatReviews
        })


    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message:"internal server error!"
        })
        
    }
}
// redis me dalne layak hai yeh!
const getReviewsByUser = async(req,res)=>{
    try {
        const userId = req.user._id
        if(!userId){
            return res.status(404).json({
                message:"user not found!"
            })
        }
        const allReviews = await Reviews.find({user:userId})
        const content = allReviews.map((review)=>{
            return {content:review.content,reviewId:review._id}
        })
      return  res.status(200).json({
            message:` ${allReviews.length} reviews found!`,
           content
        })
    } catch (error) {
         console.error(error.message);
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
}
module.exports = {getReviews,getReviewsByUser}
