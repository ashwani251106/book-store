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
       
      

     
        const userId = req.user._id
        const user_key = `userKey:${userId}`
    
       
       
       const user = await User.findById(userId)
         if(newName){
            user.name = newName
        }
        if(newEmail){
              const emailExist = await User.findOne({email:newEmail,_id:{$ne:userId}})
              if(emailExist){
                   return  res.status(423).json({
                        message:"this email already registered by other user!"
                    })
              }
            user.email = newEmail
        }
        if(newPassword){
             const salt = await bcrypt.genSalt(10);
             const hashedPass = await bcrypt.hash(newPassword,salt)

             user.password = hashedPass

        }
        await user.save()
        const {name,email,verified,} = user
        await redis.del(user_key)
        res.status(201).json({

            message:"user credentials updated",
            userId,
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