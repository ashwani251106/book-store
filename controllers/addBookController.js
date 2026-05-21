const Book = require("../models/bookSchema");
const User = require("../models/userSchema");

const addBookController = async (req, res) => {
    try {
        const { bookName, bookAuthor, bookPublication, bookStock, bookEdition, bookPrice } = req.body;


        const user = await User.findById(req.user._id);

        if (!bookName || !bookAuthor || !bookPublication || !bookStock || !bookEdition || !bookPrice) {
            return res.status(400).json({
                message: "All fields are required!"
            });
        }
        if (!user) {
            return res.status(404).json({
                message: "User does not exist!"
            });
        }

        const bookExistAlready = await Book.findOne({
            name: bookName,
            author: bookAuthor,
            publication: bookPublication
        });

        if (bookExistAlready) {
            const stocktoAdd = parseInt(bookStock) || 1;


            bookExistAlready.stock += stocktoAdd;
            await bookExistAlready.save();


            const book_given_by_user = user.books_given.find((book) =>
                book.bookId.equals(bookExistAlready._id)
            );


            if (book_given_by_user) {
                book_given_by_user.quantity += stocktoAdd;
            } else {
                user.books_given.push({ bookId: bookExistAlready._id, quantity: stocktoAdd });
            }

            await user.save();

            return res.status(200).json({
                message: "Book stock updated successfully in the store",
            });
        }


        const bookCreated = await Book.create({
            name: bookName,
            origin: user._id,
            author: bookAuthor,
            publication: bookPublication,
            edition: bookEdition,
            stock: bookStock,
            price: bookPrice
        });


        user.books_given.push({ bookId: bookCreated._id, quantity: bookStock });
        await user.save();

        return res.status(201).json({
            message: "Book added successfully in the store, Thank you!",
            book: {
                bookId:bookCreated._id,
                bookName: bookCreated.name,
                author: bookCreated.author,
                publication: bookCreated.publication,
                edition: bookCreated.edition,
                stock: bookCreated.stock
            }
        });

    } catch (error) {
        console.error("Add Book Error:", error.message);
        return res.status(500).json({
            message: "Internal server error!"
        });
    }
};

module.exports = addBookController;