const Book = require("../models/bookSchema");

const buyBook = async(req,res)=>{
    try {
       const {bookId,bookStock} = req.body;
       const quantityNeeded = parseInt(bookStock) || 1;
    if(!bookId){
        return res.status(400).json({
            nessage:"book id not given"
        })

    }

    const buyingUser = req.user; 
    if(!buyingUser){
       return res.status(404).json({
            message:"user not found"
        })
    }
    const book = await Book.findById(bookId)
    if(!book){
        res.status(404).json({message:"book not in the store!"})
    }
    if(book.stock<=0){
        res.status(400).json({message:"currently unavailable!"})
    }
    if(book.stock < quantityNeeded){
      return  res.status(400).json({
            message: `available ${book.stock} ordered ${quantityNeeded}`
        })
    }
    book.stock -= bookStock;
   await  book.save()
   buyingUser.books_taken.push(bookId)
   await buyingUser.save()
    return res.status(200).json({
        message:"book bought sucessfully",
        book:book.name
    })
    } catch (error) {
        console.log(error.message)
        return res.status(500).json({
            message:"internal server error!"
        })
    }
    

}
module.exports = buyBook;
