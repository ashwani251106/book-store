const User = require("../models/userSchema");
const Session = require("../models/sessionSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {sendEmail} = require("../services/email.services");
const { generateOtp, getOtphtml } = require("../utils/generateOtp");
const OtpModel = require("../models/otpSchema");

const register = async (req, res) => {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
        return res.status(400).json({ message: "all field is required!" });
    }
    try {
        const userAlreadyExist = await User.findOne({ email });
        if (userAlreadyExist) {
            return res.status(409).json({
                "message": "user already exist kindly login"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPass = await bcrypt.hash(password, salt);
        const user = await User.create({
            name: userName,
            email,
            password: hashPass
        });
        const otp = generateOtp();
        const html = getOtphtml(otp)
        const otpHash = crypto.createHash('sha256').update(otp).digest('hex');
        await OtpModel.create({
            email,
            user:user._id,
            otpHash
        })
        await sendEmail(email,"OTP VERIFICATION",`your otp code is ${otp}`,html)






        return res.status(201).json({ 
            "message": "user created!",
            id: user._id,
            userName,
            email,
           verified: user.verified
        });

    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "internal server error!" });
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required!" });
    }
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        if(!user.verified){
            return res.status(401).json({
                message:"verify the email first!"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const hashRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');

        const session = await Session.create({
            userId: user._id,
            refreshToken: hashRefreshToken,
            ip: req.ip
        });

        const accessToken = jwt.sign({ userId: user._id, sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: "10m" });

        res.cookie("token", refreshToken, {
            maxAge: 1000 * 3600 * 24 * 7,
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });

        return res.status(200).json({
            message: "Login successful!",
            id: user._id,
            userName: user.name,
            email: user.email,
            accessToken
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const refershIt = async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Access denied. Token missing." });
        }

        const hashRefreshToken = crypto.createHash('sha256')
            .update(refreshToken)
            .digest('hex');
            
        const sessionExist = await Session.findOne({ refreshToken: hashRefreshToken, revoke: false });
        if (!sessionExist) {
            return res.status(404).json({
                message: "no refresh token found"
            });
        }
        
        
        let payload; 
        try {
            payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
        } catch (jwterror) {
            sessionExist.revoke = true; 
            await sessionExist.save();
            return res.status(403).json({ message: "Refresh token expired or tampered with" });
        }
        
       
        const accessToken = jwt.sign({ userId: payload.userId, sessionId: sessionExist._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const newrefreshToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
        
        res.cookie("token", newrefreshToken, {
            maxAge: 1000 * 3600 * 24 * 7, 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production",   
            sameSite: 'strict' 
        });
        
        const newHashRefreshToken = crypto.createHash('sha256')
            .update(newrefreshToken)
            .digest('hex');
            
        sessionExist.refreshToken = newHashRefreshToken;
        await sessionExist.save();
        
        return res.status(200).json({ 
            message: "access token generated now !",
            accessToken,
        });
    } catch (error) {
        console.error("Refresh Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (refreshToken) {
            const hashRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
           
            await Session.findOneAndUpdate({ refreshToken: hashRefreshToken }, { revoke: true });
        }
        
        
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};


const logoutAll = async (req, res) => {
    try {
        const refreshToken = req.cookies.token;
        if (!refreshToken) {
            return res.status(401).json({ message: "Authentication required" });
        }

       
        const decoded = jwt.decode(refreshToken);
        if (!decoded || !decoded.userId) {
            return res.status(400).json({ message: "Invalid token data" });
        }

       
        await Session.updateMany({ userId: decoded.userId }, { revoke: true });

        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out from all devices successfully" });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const verifyEmail = async (req,res)=>{
    const {otp,email} = req.body
    const otpHash =  crypto.createHash('sha256').update(otp).digest('hex');
    const otpDoc = await OtpModel.findOne({
        email,
        otpHash
    })
    if(!otpDoc){
        return res.status(400).json({
            message:"invalid otp!"
        })
    }
    const user = await User.findByIdAndUpdate(otpDoc.user,{verified: true},{new:true})
    await OtpModel.deleteMany({
        user:otpDoc.user
    })
    
   return res.status(200).json({
    message:"otp verifed sucessfully!",
    User:{
        userName:user.name,
        email:user.email,
        verified:user.verified
    }
   })
}
module.exports = { register, login, refershIt, logout, logoutAll , verifyEmail};