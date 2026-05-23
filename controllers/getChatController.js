const redis = require("../config/redisConfig");
const messageModel = require("../models/messageModel");

const getChatController = async (req, res) => {

    try {
        const { chatId } = req.params
      
        if (!chatId) {
            return res.status(400).json({
                message: "chat id is required"
            })
        }
          const chat_key = `cache:chat:${chatId}`;
        const messages = await messageModel.find({ chatId }).populate("senderId","name")
       
       const time = 36000 + parseInt(Math.random()*600)
        await redis.setex(chat_key,time,JSON.stringify(messages))
        return res.status(200).json({
            message:"chat retreived successfully!",
            messages,

        })
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message: "internal server error!"
        })

    }
}
module.exports = getChatController