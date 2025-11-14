import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

// -----------------------------------
// USER SIGNUP
// -----------------------------------

import { generateOTP } from "../utils/generateOTP.js";
import sendEmail from "../utils/sendEmail.js";

// USER SIGNUP with OTP
export const registerUser = async (req, res) => {
    try {
        const {
            name,
            email,
            password,
            studentId,
            department,
            phone,
            address,
            yearOfStudy,
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Name, email and password are required" });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const otp = generateOTP();
        const otpExpire = Date.now() + 15 * 60 * 1000; // 15 min

        const idCardPath = req.file ? `/uploads/user_idcards/${req.file.filename}` : null;

        const newUser = new User({
            name,
            email,
            password,
            studentId,
            department,
            phone,
            address,
            yearOfStudy,
            idCard: idCardPath,
            otp,
            otpExpire,
        });

        await newUser.save();

        // 📩 Send OTP Email
        await sendEmail({
            to: email,
            subject: "Your OTP Verification Code",
            html: `
        <h2>Hello ${name},</h2>
        <p>Your E-Grievance Portal verification code is:</p>
        <h1>${otp}</h1>
        <p>This OTP is valid for <strong>15 minutes</strong>.</p>
      `,
        });

        res.status(201).json({
            message: "Signup successful. Please verify OTP sent to your email.",
            userId: newUser._id,
        });
    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        if (Date.now() > user.otpExpire)
            return res.status(400).json({ message: "OTP expired" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpire = null;

        await user.save();

        res.json({ message: "OTP verified successfully. You can now log in." });
    } catch (error) {
        console.error("OTP Verify Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password)
            return res.status(400).json({ message: "Email and password required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        // ❗ Block unverified users
        if (!user.isVerified) {
            return res.status(403).json({
                message: "Please verify your email OTP first"
            });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = generateToken(user);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email)
            return res.status(400).json({ message: "Email required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const otp = generateOTP();
        const otpExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetToken = otp;
        user.resetTokenExpire = otpExpire;
        await user.save();

        await sendEmail({
            to: email,
            subject: "Reset Password OTP",
            html: `
                <h2>Password Reset Request</h2>
                <p>Your OTP to reset password is:</p>
                <h1>${otp}</h1>
                <p>Valid for 10 minutes.</p>
            `,
        });

        res.json({ message: "OTP sent to your email" });

    } catch (error) {
        console.error("Forgot Password Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (user.resetToken !== otp)
            return res.status(400).json({ message: "Invalid OTP" });

        if (Date.now() > user.resetTokenExpire)
            return res.status(400).json({ message: "OTP expired" });

        res.json({ message: "OTP verified. You can reset your password now." });

    } catch (error) {
        console.error("Verify Reset OTP Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword)
            return res.status(400).json({ message: "Email and new password required" });

        const user = await User.findOne({ email });
        if (!user)
            return res.status(404).json({ message: "User not found" });

        user.password = newPassword;
        user.resetToken = null;
        user.resetTokenExpire = null;

        await user.save();

        res.json({ message: "Password reset successful. You can now log in." });

    } catch (error) {
        console.error("Reset Password Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
