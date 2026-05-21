const  mongoose  = require("mongoose");
const messageSchema = new mongoose.Schema({
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chatId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"ChatModel",
        required:true
    },
    message:{
        type:String,
        
        required:true
    }
},{timestamps:true})
const messageModel = mongoose.model("messageModel",messageSchema)
module.exports = messageModel