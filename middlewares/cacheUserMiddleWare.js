const { json } = require("express");
const redis = require("../config/redisConfig");

const cacheUserProfile = async(req,res,next)=>{
    const userId = req.user._id
    const user_key = `userKey:${userId}`
    const user_data_string = await redis.get(user_key)
    if(!user_data_string){
        console.log("cache miss redirecting to DB");
        return next();        
    }
    const user_data_json = JSON.parse(user_data_string)
    return res.status(200).json({
        ...user_data_json
    })
}
module.exports = cacheUserProfile