const redis = require("../config/redisConfig");
const Book = require("../models/bookSchema");
const chapterModel = require("../models/chapters");
const onProgressBookModel = require("../models/onProgressBookModel");
const User = require("../models/userSchema");

const writeBook = async (req, res) => {
    try {
        const { title } = req.body
        if (!title) {
            return res.status(400).json({
                message: "title is required!"
            })
        }
        const userId = req.user._id
        if (!userId) {
            return res.status(404).json({
                message: "user is unauthorized"
            })
        }
        const addBook = await onProgressBookModel.create({
            title,
            authorId: userId,
            chapters: []
        })
        return res.status(200).json({
            message: "now write the book",
            bookId: addBook._id
        })
    } catch (error) {
        console.log(error.message);

        return res.status(500).json({
            message: "internal server error!"
        })
    }
}
const generateChapters = async (req, res) => {
    try {
        const { bookId } = req.params
        if (!bookId) {
            return res.status(400).json({
                message: "no book id provided"
            })
        }
        const { subtitle } = req.body
        if (!subtitle) {
            return res.status(400).json({
                message: "subtitles are required"
            })
        }
        const newChapter = await chapterModel.create({
            bookId,
            subtitle,

        })
        const book = await onProgressBookModel.findByIdAndUpdate({ _id: bookId }, { $push: { chapters: newChapter._id } }, { new: true })
         const chapter_key = `getchaptersofabook${bookId}`
         await redis.del(chapter_key)


        return res.status(201).json({
            newChapter
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "internal server error!" })

    }
}
const saveChapterContent = async (req, res) => {
    try {
        const { chapterId } = req.params
        if (!chapterId) {
            return res.status(400).json({
                message: "no chapter id provided"
            })
        }
        const { subtitle, content } = req.body

        const updatedChapter = await chapterModel.findByIdAndUpdate(chapterId, { subtitle, content })

        return res.status(200).json({

            message: "chapter updated successfully!",
            chapterId
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "internal server error!" })
    }
}
const publishBook = async (req, res) => {
    try {
        const { bookId } = req.params
        const {publication,edition,stock,price} = req.body  // take it from the user
        const draft_of_user = `getalldraftofauser:${userId}`
         const original_source_key = `originalsourcekey:original`
        const userId = req.user._id
       
        if (!userId) {
            return res.status(404).json({
                message: "user is unauthorized"
            })
        }
        

        if (!bookId) {
            return res.status(400).json({
                message: "no book id provided"
            })
        }
        const bookDetails = await onProgressBookModel.findById(bookId).populate("chapters","subtitle content").populate("authorId","name")
        const bookAddedToMarket  = await Book.create({
            name: bookDetails.title,
            origin: userId,
            authorId:userId,
            authorName:bookDetails.authorId.name,
            publication,
            edition,
            stock,
            price,
            source:"original",
            publishedContent:bookDetails.chapters
        })
        await redis.unlink( draft_of_user) 
        await redis.unlink(original_source_key)
        await User.findByIdAndUpdate(userId,{$push:{
            books_given:{
               bookId: bookAddedToMarket._id,
               quantity:stock
            }
        }},{new:true})
        await chapterModel.deleteMany({ bookId });
        await onProgressBookModel.findByIdAndDelete(bookId)
        res.status(201).json({
            message:"book sent to market",
            bookAddedToMarket
        })


    } catch (error) {
         console.log(error.message);
        return res.status(500).json({ message: "internal server error!" })
    }
}
// redis can be used here!
const getChaptersOfABook = async(req,res)=>{
    try {
        const {bookId} = req.params
         if (!bookId) {
            return res.status(400).json({
                message: "no book id provided"
            })
        }
        const allChapters = await chapterModel.find({bookId}).select("subtitle")
        const chapterNames = allChapters.map((chapter)=>chapter.subtitle)
        const chapter_key = `getchaptersofabook${bookId}`
        const jitter = Math.floor(Math.random() * 600);
        await redis.setex(chapter_key,36000+jitter,JSON.stringify(chapterNames))
        res.status(200).json({
            message:` ${allChapters.length} chapters found!`,
            chapterNames

        })
    } catch (error) {
          console.log(error.message);
        return res.status(500).json({ message: "internal server error!" })
    }
}
// redis applied here!
const  getUnpublishedDrafts= async(req,res)=>{
    
    try {
        const userId = req.user._id
        const getdrafts = await onProgressBookModel.find({authorId:userId})
        const draft_of_user = `getalldraftofauser:${userId}`
        const  jitter = Math.floor(Math.random() * 600);
        await redis.setex(draft_of_user,36000+jitter,JSON.stringify(getdrafts))

        return res.status(200).json({
            message:`${getdrafts.length} books are in progress`,
            getdrafts
        })

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({message:"internal server error!"})
        
    }
}
module.exports = { writeBook, generateChapters,saveChapterContent,publishBook,getChaptersOfABook,getUnpublishedDrafts }
