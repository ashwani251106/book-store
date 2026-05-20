 const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
 
 const isAuth = async(req,res,next)=>{
    try {
       
    const authHeader = req.headers.authorization;


    const token = authHeader && authHeader.split(" ")[1];
        if(!token){
           return  res.status(403).json({
                message:"no token found!"
            })
        }
        const tokenPayload = jwt.verify(token,process.env.JWT_SECRET)
        const userId = tokenPayload.userId;
        const findUser = await User.findById(userId)
        if(!findUser){
            return res.status(404).json({
                message:"user not found!"
            })
        }
        if(!findUser.verified){
           return  res.status(403).json({
            message:"user not verified"
        })
        }
        req.user = findUser
        next();

        
    } catch (error) {
        console.log(error);
       return  res.status(403).json({
            message:"user not authorized request forbidden!"
        })
    }
 }
 module.exports = isAuth