const Book = require("../models/bookSchema");
const Reviews = require("../models/reviewSchema");
const User = require("../models/userSchema");

const generateReviews = async (req, res) => {
    try {
        const {bookId} = req.params
        const {content} = req.body
        if (!content || !bookId) {
            return res.status(400).json({
                message: "all fields required!"
            })
        }
        const userId = req.user._id
        if (!userId) {
            return res.status(401).json({
                message: "user not authorized!"
            })
        }
       
        if (!userId) {
            return res.status(404).json({
                message: "user not found!"
            })
        }
        const book = await Book.findById(bookId)
        if(!book){
             return res.status(402).json({
                message: "select a book to enter a review!"
            })
        }
        const newReview = await Reviews.create({
            user:userId,
            content
        })
        book.review.push(newReview._id)
        await book.save()
        user.comments.push(newReview._id)
        await user.save()

        res.status(200).json({

            message: "thanks for the review!",
            reviewId:newReview._id,
            review:newReview.content
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal server error!"
        })

    }

}
const deleteReviews = async(req,res)=>{
    try {
         const {reviewId} = req.params
         
         if(!reviewId){
           return res.status(400).json({
                message:"no review selected"
            })
         }
         const reviewAuthor = req.user
         if(!reviewAuthor){
            return res.status(404).json({
                message:"user not found"
            })
         }
        const deleteit = await Reviews.findOneAndDelete({_id:reviewId,user:reviewAuthor._id})
        if(!deleteit){
           return res.status(401).json({
                message:"you are not authorized to delete this review!"
            })
        }
       await User.findByIdAndUpdate(reviewAuthor._id,{
        $pull:{comments:reviewId}
       })

        res.status(200).json({
            message:"review deleted successfully!"
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"internal server error!"
        })
        
    }
       
}
module.exports = {generateReviews , deleteReviews}
