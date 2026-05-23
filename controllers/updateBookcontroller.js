const Book = require("../models/bookSchema");

const updateBookDetails = async (req, res) => {
    try {
        const { bookId, newName, newauthorName, newPublication, newEdition, newStock, newPrice } = req.body;
        
       
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized! Please log in." });
        }
        
      
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: "Book not found!" });
        }

       
        if (book.origin.toString() !== req.user.id) {
            return res.status(403).json({ message: "Forbidden! You do not own this book." });
        }

       
        const updateFields = {};
        if (newName) updateFields.name = newName;
        if (newauthorName) updateFields.authorName = newauthorName;
        if (newPublication) updateFields.publication = newPublication;
        if (newEdition) updateFields.edition = newEdition;
        if (newStock !== undefined) updateFields.stock = newStock; 
        if (newPrice) updateFields.price = newPrice;

       
        const updatedBook = await Book.findByIdAndUpdate(bookId, updateFields, { new: true });

        
      
        return res.status(200).json({
            message: "Book updated successfully!",
            updatedBook
        });

    } catch (error) {
        console.error("Update error:", error.message);
        return res.status(500).json({ message: "Update failed" });
    }
};
module.exports = updateBookDetails