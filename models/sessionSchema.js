const mongoose = require("mongoose")
const sessionSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:[true,"user id is required!"]
    },
    refreshToken:{
        type:String,
        required:[true,"refresh token is required!"]
    },
    revoke:{
        type:Boolean,
        default:false
    },
    ip:{
        type:String
    }
},{
    timestamps:true
})

const Session = mongoose.model("Session",sessionSchema)
module.exports = Session
