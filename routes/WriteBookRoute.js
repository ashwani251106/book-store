const express = require("express")
const {writeBook,generateChapters, saveChapterContent,publishBook,getChaptersOfABook} = require("../controllers/writeBookController")
const isAuth = require("../middlewares/isAuth")
const writeBookrouter = express.Router()

writeBookrouter.post("/startWriting",isAuth,writeBook)
writeBookrouter.get("/chapters/:bookId",isAuth,generateChapters)
writeBookrouter.post("/saveChapter/:chapterId",isAuth,saveChapterContent)
writeBookrouter.post("/publishbook/:bookId",isAuth,publishBook)
writeBookrouter.get("/getChapters/:bookId",isAuth,getChaptersOfABook)
module.exports = writeBookrouter