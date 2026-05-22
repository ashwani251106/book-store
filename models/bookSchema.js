const mongoose = require("mongoose")
const publishedChapterSchema = new mongoose.Schema({
    subtitle: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String, 
        required: true
    }
}, { _id: false }
)
const bookSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
           index:true


    },
    origin:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    authorName:{
        type:String,
           index:true

       
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        index:true

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
    },
    buyers:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    review:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reviews"
    }],
    source:{
        type:String,
        required:true,
        enum:["original","used"] ,
           index:true
   
    },
    publishedContent:[publishedChapterSchema]
    
},{
    timestamps:true
})
const Book = mongoose.model("Book",bookSchema)
module.exports = Book