const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    books_given:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Book'
    }],
    books_taken:[{
         type: mongoose.Schema.Types.ObjectId,
        ref:'Book'
    }],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Reviews'
        }
    ],
    verified:{
        type:Boolean,
        default:false
    }

    
},{
    timestamps:true
})

const User = mongoose.model("User",userSchema)
module.exports = User;