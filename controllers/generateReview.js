const Book = require("../models/bookSchema");
const Reviews = require("../models/reviewSchema");
const User = require("../models/userSchema");

const generateReviews = async (req, res) => {
    try {
        const {content,bookId} = req.body
        if (!content) {
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
        const user = await User.findById(userId)
        if (!user) {
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
            user,
            content
        })
        book.review.push(newReview._id)
        await book.save()
        user.comments.push(newReview._id)
        await user.save()

        res.status(200).json({
            message: "thanks for the review!",
            review:newReview.content
        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal server error!"
        })

    }

}
module.exports = generateReviews
