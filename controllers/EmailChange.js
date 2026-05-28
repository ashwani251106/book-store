const { generatePrime } = require("crypto");


const requestEmailChange = async (req, res) => {
    const { newEmail } = req.body;
    const userId = req.user._id; 

    try {
        const normalizedEmail = newEmail.toLowerCase();

       
        const emailExists = await User.findOne({ email: normalizedEmail, _id: { $ne: userId } });
        if (emailExists) {
            return res.status(409).json({ message: "This email is already in use." });
        }

       
        const otpCode = generatePrime()

       
        await redisClient.setEx(`email-change:${userId}`, 300, JSON.stringify({ 
            newEmail: normalizedEmail, 
            otpCode 
        }));

       
        await sendEmail({
            to: normalizedEmail,
            subject: "Verify your new email address",
            text: `Your OTP to change your email is: ${otpCode}. It expires in 5 minutes.`

        });

        res.status(200).json({ message: "OTP sent to your new email address." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// POST /api/user/verify-email-change
const verifyEmailChange = async (req, res) => {
    const { otpEntered } = req.body;
    const userId = req.user._id;

    try {
      
        const savedDataStr = await redisClient.get(`email-change:${userId}`);
        
        if (!savedDataStr) {
            return res.status(400).json({ message: "OTP expired or request not found. Try again." });
        }

        const { newEmail, otpCode } = JSON.parse(savedDataStr);

       
        if (otpEntered !== otpCode) {
            return res.status(400).json({ message: "Invalid OTP code." });
        }

      
        const emailExists = await User.findOne({ email: newEmail, _id: { $ne: userId } });
        if (emailExists) {
            return res.status(409).json({ message: "This email was taken while you were verifying." });
        }

       
        await User.findByIdAndUpdate(userId, { email: newEmail });

      
        await redisClient.del(`email-change:${userId}`);

        res.status(200).json({ message: "Email updated successfully! Please log in again if required." });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
module.exports = {requestEmailChange,verifyEmailChange}