const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    author:{
        type:String,
        required:true
    },
    publication:{
        type:String,
        
    },
    edition:{
        type:Number
    },
    stock:{
        type:Number
    }
},{
    timestamps:true
})
const Book = mongoose.model("Book",bookSchema)
module.exports = Book