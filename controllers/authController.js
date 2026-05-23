const User = require("../models/userSchema");
const Session = require("../models/sessionSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../services/email.services");
const { generateOtp, getOtphtml } = require("../utils/generateOtp");
const OtpModel = require("../models/otpSchema");
const redis = require("../config/redisConfig")

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
        const otp_key = `Authentication/otp/:${user._id}`
        await redis.setex(otp_key,600,otp)
        const ttl = await redis.ttl(otp_key)
        await sendEmail(email, "OTP VERIFICATION", `your otp code is ${otp}`, html)






        return res.status(201).json({
            "message": "user created!",
            id: user._id,
            userName,
            email,
            verified: user.verified,
            otp_time:ttl
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
        if (!user.verified) {
            return res.status(401).json({
                message: "verify the email first!"
            })
        }

        if (user.isLocked && user.lockUntil && user.lockUntil > Date.now()) {
            const minutesLeft = Math.ceil((user.lockUntil - Date.now()) / 60000);
            return res.status(423).json({
                message: `Account is temporarily locked. Try again in ${minutesLeft} minutes.`
            });
        }


        if (user.isLocked && user.lockUntil && user.lockUntil <= Date.now()) {
            user.isLocked = false;
            user.loginAttempts = 0;
            user.lockUntil = undefined;
            await user.save();
        }


        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {

            user.loginAttempts += 1;


            if (user.loginAttempts >= 5) {
                user.isLocked = true;
                user.lockUntil = new Date(Date.now() + 15 * 60 * 1000); // Current time + 15 mins
            }

            await user.save();

            const attemptsRemaining = 5 - user.loginAttempts;
            return res.status(401).json({
                message: user.loginAttempts >= 5
                    ? "Too many incorrect attempts. Your account has been locked for 15 minutes."
                    : `Invalid credentials. You have ${attemptsRemaining} attempts left before account lock.`
            });
        }


        user.loginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = undefined;
        await user.save();


        const refreshToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
        const hashRefreshToken = crypto.createHash('sha256').update(refreshToken).digest('hex');
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        const session = await Session.create({
            userId: user._id,
            refreshToken: hashRefreshToken,
            ip: req.ip,
            expiresAt:sevenDaysFromNow
        });

        const accessToken = jwt.sign({ userId: user._id, sessionId: session._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

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

           await Session.findOneAndDelete({ refreshToken: hashRefreshToken });
         
        }


        res?.clearCookie("token");
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

const verifyEmail = async (req, res) => {
    const { otp, email } = req.body
    const {userId} = req.params
     const otp_key = `Authentication/otp/:${userId}`
     const redis_otp =await redis.get(otp_key)
     if(!redis_otp){
       return res.status(400).json({
            message:"otp not exist or expired"
        })
     }

     if(String(otp)!==String(redis_otp)){
       return res.status(400).json({
            message:"otp mismatch"
        })
     }
     const user = await User.findByIdAndUpdate(userId,{verified:true},{new:true})

    await redis.del(otp_key)

    return res.status(200).json({
        message: "otp verifed sucessfully!",
        User: {
            userName: user.name,
            email: user.email,
            verified: user.verified
        }
    })
}
module.exports = { register, login, refershIt, logout, logoutAll, verifyEmail };