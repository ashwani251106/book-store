const { default: mongoose } = require("mongoose");

const onProgressBookSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    authorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
           index:true

    },
    chapters:[{
          type:mongoose.Schema.Types.ObjectId,
        ref:"chapterModel",
        required:true,
           index:true

    }]
})
const onProgressBookModel = mongoose.model("onProgressBookModel",onProgressBookSchema)
module.exports = onProgressBookModel