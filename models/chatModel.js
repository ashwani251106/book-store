const  mongoose  = require("mongoose");
const chatSchema = new mongoose.Schema({
    sellerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    buyerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    bookId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Book",
        required:true
    }
},{timestamps:true})
const ChatModel = mongoose.model("ChatModel",chatSchema)
module.exports = ChatModel