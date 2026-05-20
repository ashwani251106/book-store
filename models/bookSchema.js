const mongoose = require("mongoose")
const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    origin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
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
    },
    price:{
        type:Number,
        required:[true , "price is required!"],
        default:100
    }
},{
    timestamps:true
})
const Book = mongoose.model("Book",bookSchema)
module.exports = Book