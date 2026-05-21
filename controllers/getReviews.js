const Book = require("../models/bookSchema");
const Reviews = require("../models/reviewSchema");
const User = require("../models/userSchema");

const getReviews = async(req,res)=>{
    const {bookId} = req.body
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
module.exports = getReviews
