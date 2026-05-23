require("dotenv").config()
const express = require("express")
const {Server} = require("socket.io")
const http = require("http")
const cors = require("cors")
const app = express()
const httpServer = http.createServer(app)
const socket = new Server(httpServer,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoute")
const profileRouter = require("./routes/profileRoute")
const addBookRouter = require("./routes/addBookRoute")
const buyBookRouter = require("./routes/buyBookRoute")
const reviewRouter = require("./routes/reviewRoute")
const chatRouter = require("./routes/chatRoute")

const messageModel = require("./models/messageModel")
const viewBookRoute = require("./routes/viewBookRoute")
const writeBookrouter = require("./routes/WriteBookRoute")

mongoose.connect(process.env.MONGO_STRING,{
    maxPoolSize: 10, 
    minPoolSize: 2,
}).then(()=>console.log("mongo Connected!")).catch((error)=>console.log(error))
app.use(express.json())
app.use(cookieParser())
app.use("/api",authRouter)
app.use("/api",profileRouter)
app.use("/api",addBookRouter)
app.use("/api",buyBookRouter)
app.use("/api",reviewRouter)
app.use("/api",chatRouter)
app.use("/api",viewBookRoute)
app.use("/api",writeBookrouter)
app.get("/",(req,res)=>{
    res.send("welcome sir how are you ? ")
})
const userMap = new Map()
socket.on("connection",(socket)=>{
   const userId = socket.handshake.query.userId
   userMap.set(userId,socket.id)
   socket.on("disconnect",()=>{
    userMap.delete(userId)
    console.log("user went offline!");
    
   })
   socket.on("joinChat",(data)=>{
        const chatId = data.chatId // from the frontend .....
        socket.join(chatId)
        console.log("user joined room");
        

   })
   socket.on("sendMessage",async(data)=>{
    const {chatId,senderId,message} = data
        socket.to(chatId).emit("receiveMessage",{senderId,message})
        const messageAdded = await messageModel.create({
            chatId,
            senderId,
            message
        })
   })
    
})

httpServer.listen(process.env.PORT,()=>{
    console.log("server is up and running very good!");
    
})