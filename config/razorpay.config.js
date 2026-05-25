const Razorpay = require("razorpay")

const razorpay = new Razorpay({
    key_id:process.env.Test_Key_ID,
    key_secret:process.env.Test_Key_Secret
})

module.exports = razorpay