const redis = require("../config/redisConfig")


const cacheChatMiddleWare = async(req,res,next)=>{
    try {
        const {chatId} = req.params
        const chat_key = `cache:chat:${chatId}`
        const messages_string = await redis.get(chat_key)
        if(!messages_string){
            console.log("cache miss sending to DB");
            return next()
            
        }
        const messages_json = JSON.parse(messages_string)
        console.log("cache hit sending chat from redis!");
        
         return res.status(200).json({
            
            message:"chat retreived successfully!",
            messages:messages_json,

        })

    } catch (error) {
        console.log("redis error");
        return next()
    }
}
module.exports = cacheChatMiddleWare