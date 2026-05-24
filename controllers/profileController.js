const redis = require("../config/redisConfig");
const Book = require("../models/bookSchema");
const User = require("../models/userSchema");
const bcrypt = require("bcrypt")

const profile = async (req, res) => {
    try {
        const userDetails = req.user
        const jitter = parseInt(Math.random()*600)
        const user_key = `userKey:${req.user._id}`
        await redis.setex(user_key,36000+jitter,JSON.stringify(userDetails))

       return res.status(200).json({...userDetails})
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            message:"internal server error"
        })
    }

}
const changeProfile = async(req,res)=>{
    try {
        const {newName,newEmail,newPassword} = req.body
        if(!newName || !newEmail){
            return res.status(400).json({
                message:"all fields are required!"
            })
        }
        // if(req.user.email===newEmail){
        //     return res.status(400).json({
        //         message:"kindly change your credentials"
        //     })
        // }
       
        const userId = req.user._id
        const user_key = `userKey:${userId}`
        const salt = await bcrypt.genSalt(10);
        const newPassHashed = await bcrypt.hash(newPassword,salt)
        const updatedUser = await User.findByIdAndUpdate(userId,{name:newName,email:newEmail,password:newPassHashed},{new:true})
        const {name,email,verified,} = updatedUser
        await redis.del(user_key)
        res.status(201).json({
            message:"user credentials updated",
            name,
            email,
            verified,

        })
    } catch (error) {
         console.log(error.message);
        res.status(500).json({
            message:"internal server error"
        })
    }
}
 
module.exports = {profile,changeProfile};