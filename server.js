require("dotenv").config()
const express = require("express")
const cors = require("cors")
const app = express()
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const authRouter = require("./routes/authRoute")
const profileRouter = require("./routes/profileRoute")
mongoose.connect(process.env.MONGO_STRING).then(()=>console.log("mongo Connected!")).catch((error)=>console.log(error))
app.use(express.json())
app.use(cookieParser())
app.use("/api",authRouter)
app.use("/api",profileRouter)

app.get("/",(req,res)=>{
    res.send("welcome sir how are you ? ")
})

app.listen(process.env.PORT,()=>{
    console.log("server is up and running very good!");
    
})