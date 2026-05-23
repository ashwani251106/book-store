const Book = require("../models/bookSchema");


const profile = async (req, res) => {
    try {
        const { name, email, books_given, books_taken } = req.user
        const books_sold_by_user = await Book.find({ _id: { $in: books_given } })
        const books_bought_by_user = await Book.find({ _id: { $in: books_taken } })
        res.status(200).json({
            name,
            email,
            books_sold_by_user,
            books_bought_by_user,



        })
    } catch (error) {
        console.log(error.message);
        res.status(400).json({
            error
        })
    }

}
module.exports = profile;