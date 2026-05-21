const ChatModel = require("../models/chatModel");
const messageModel = require("../models/messageModel");
const User = require("../models/userSchema");

const chatController = async(req,res)=>{
    try {
        const {sellerId,bookId} = req.body
        if(!sellerId || !bookId){
           return res.status(400).json({
                message:"all fields are required"
            })
        }
        const buyerId = req.user._id
        
        if(!buyerId){
              return res.status(404).json({
                message:"user not exist in the database"
            })
        }
      
        const chatExisted = await ChatModel.findOne({sellerId,bookId,buyerId})
        if(chatExisted){
           return res.status(200).json({
                message:"chat existed previously!",
                chatId:chatExisted._id,

            })
        }
        const chatCreated = await ChatModel.create({
            sellerId,
            buyerId,
            bookId
        })
        return res.status(200).json({
            message:"chat created sucessfully!",
            chatId:chatCreated._id
        })

    } catch (error) {
        console.log(error.message);
       return res.status(500).json({
            message:"internal server error!"
        })
        
    }
}
module.exports = chatController

