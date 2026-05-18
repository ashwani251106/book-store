const  mongoose = require("mongoose")

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    otpHash:{
        type:String,
        required:[true,"Otp is required!"]
    }
}, 

{
    timestamps:true
})

const OtpModel = mongoose.model("OtpModel",otpSchema);
module.exports = OtpModel;