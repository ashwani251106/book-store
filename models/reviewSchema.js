const mongoose  = require("mongoose")
const reviewSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        index:true

    },
    content:{
        type:String,
        required:true,

    },
    
},{
    timestamps:true
})
const Reviews = mongoose.model("Reviews",reviewSchema)
module.exports = Reviews;
