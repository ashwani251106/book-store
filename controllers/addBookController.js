const Book = require("../models/bookSchema");
const User = require("../models/userSchema");

const addBookController = async(req,res)=>{
    try {
        const {bookName,bookAuthor,bookPublication,bookStock,bookEdition,bookPrice} = req.body
        const userId = req.user._id
        if(!bookName || !bookAuthor ||!bookPublication || !bookStock || !bookEdition ||!bookPrice){
           return res.status(500).json({
                message:"all field are required!"
            })
        }
        if(!userId){
           return res.status(404).json({
                message:"user not exist!"
            })
        }
      
        const user = await User.findById(userId)
        if(!user){
            res.status(404).json({
                message:"user not in db!"
            })
        }
          const bookExistAlready = await Book.findOne({
            name:bookName,
            author:bookAuthor,
            publication:bookPublication

        })
        if(bookExistAlready){
            const stocktoAdd = parseInt(bookStock) || 1;
            bookExistAlready.stock +=stocktoAdd;
         await bookExistAlready.save();
         user.books_given.push(bookExistAlready._id)
         await user.save()
        return  res.status(200).json({
                message:"book added successfully in the store"
            })
        }
        const bookCreated = await Book.create({
            name:bookName,
            origin:userId,
            author:bookAuthor,
            publication:bookPublication,
            edition:bookEdition,
            stock:bookStock,
          
        })
        user.books_given.push(bookCreated._id);
        user.save()
         return  res.status(200).json({
                message:"book added successfully in the store, Thank you!"
            })

    } catch (error) {
        console.log(error.message);
        res.status(440).json({
            message:"internal server error!"
        })
        
    }
}
module.exports = addBookController
