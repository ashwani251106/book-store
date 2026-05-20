const profile = (req,res)=>{
   return res.status(200).json({
        message:"this is your profile my friend!"
    })
}
module.exports = profile;