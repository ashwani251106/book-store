const Book = require("../models/bookSchema");
const redis = require("../config/redisConfig");

const viewBook = async (req, res) => {
    try {
        const { bookId } = req.params;
        if (!bookId) {
            return res.status(400).json({ message: "book id is required!" });
        }

       
        const book_obj = await Book.findById(bookId).lean();
        if (!book_obj) {
            return res.status(404).json({ message: "Book not found!" });
        }

       
        const liveStock = await redis.get(`stock:book:${bookId}`);

      
        if (liveStock !== null) {
            book_obj.stock = parseInt(liveStock);
        }

       
        const view_book_key = `viewbookkey:${bookId}`; 
        const jitter = Math.floor(Math.random() * 600);
        
       
        await redis.setex(view_book_key, 36000 + jitter, JSON.stringify(book_obj));

       
        return res.status(200).json({
            success: true,
            bookId,
            bookName: book_obj.name,
            bookAuthor: book_obj.author,
            bookPublication: book_obj.publication,
            bookEdition: book_obj.edition,
            bookStock: book_obj.stock,
            bookPrice: book_obj.price
        });

    } catch (error) {
        console.error("Error in viewBook controller:", error.message);
        return res.status(500).json({ message: "internal server error!" });
    }
};

module.exports = viewBook;