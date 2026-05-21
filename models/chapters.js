const { default: mongoose } = require("mongoose");

const chapterSchema = new mongoose.Schema({
   bookId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"onProgressBookModel",
    required:true

   },
   subtitle:{
        type:String,
        required:true
   },
   content:{
    type:String,
    
   }
})
const chapterModel = mongoose.model("chapterModel",chapterSchema)
module.exports = chapterModel