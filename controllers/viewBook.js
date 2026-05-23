const Book = require("../models/bookSchema");
// redis me daal sakte hai ...
const viewBook = async (req, res) => {
    try {
        const { bookId } = req.params
        if (!bookId) {
            return res.status(400).json({
                message:"book id is required!"
            })
        }
        const book = await Book.findById(bookId)
        res.status(200).json({
            bookId,
            bookName:book.name,
            bookAuthor:book.author,
            bookPublication:book.publication,
            bookEdition:book.edition,
            bookStock:book.stock,
            bookPrice:book.price,


        })

    } catch (error) {
        console.log(error.message);
        res.status(500).json({message:"internal server error!"})
        
    }

}
module.exports = viewBook