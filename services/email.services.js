const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        type:"OAuth2",
        user:process.env.GOOGLE_USER,
        clientId:process.env.GOOGLE_CLIENT_ID,
        clientSecret:process.env.GOOGLE_CLIENT_SECRET,
        refreshToken:process.env.GOOGLE_REFRESH_TOKEN
    }
}) 
transporter.verify((error,sucess)=>{
    if(error){
        console.error('Error connecting to email server',error)
    }else{
        console.log('Email server is ready to send messages')
    }
})


const sendEmail = async (to,subject,text,html)=>{
    try {
        const info = await transporter.sendMail({
            from:`"online book store" <${process.env.GOOGLE_USER}>`,
            to,
            subject,
            text,
            html,
        })
        console.log("message sent: %s",info.messageId);
        console.log("preview URL: %s",nodemailer.getTestMessageUrl(info))
        
    } catch (error) {
        console.error("error sending email:",error);
    }
}
module.exports = {transporter,sendEmail}