import { generateToken } from "../utils/token-generator.js";
import Auth from "../models/auth.model.js";
import bcrypt from "bcryptjs";
import zxcvbn from "zxcvbn";
import { sendOTP } from "../utils/sendOTP.js";
import Task from "../models/task.model.js"
import BlacklistToken from "../models/blacklistToken.model.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered' });
        }

        const strength = zxcvbn(password);
        if (strength.score < 3) {
            return res.status(400).json({ message: 'Weak password. Try again.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

        const newUser = new Auth({
            name,
            email,
            password: hashedPassword,
            otp,
            otpExpiresAt: otpExpiry,
        });

        await newUser.save();
        await sendOTP(email, otp);

        res.status(201).json({ message: 'Signup successful. OTP sent to email.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified" });
        }

        const now = Date.now();
        const lastSent = user.lastOtpSentAt ? user.lastOtpSentAt.getTime() : 0;

        if (now - lastSent < 60 * 1000) {
            const waitTime = Math.ceil((60 * 1000 - (now - lastSent)) / 1000);
            return res.status(429).json({
                message: `Please wait ${waitTime} more second(s) before requesting a new OTP.`,
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(now + 1 * 60 * 1000);

        user.otp = otp;
        user.otpExpiresAt = otpExpiry;
        user.lastOtpSentAt = new Date();
        await user.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: "OTP resent successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.isVerified) {
            return res.status(400).json({ message: 'User already verified' });
        }

        if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: 'User verified successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        if (!user.isVerified) {
            return res.status(401).json({ message: "Email not verified. Please verify your account." });
        }

        const token = generateToken(user._id, user.email);

        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 1 * 60 * 1000);

        user.otp = otp;
        user.otpExpiresAt = otpExpiry;
        user.lastOtpSentAt = new Date();
        await user.save();

        await sendOTP(email, otp);

        res.status(200).json({ message: 'OTP sent to your email for password reset.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        const user = await Auth.findOne({ email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (user.otp !== otp || user.otpExpiresAt < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        const strength = zxcvbn(newPassword);
        if (strength.score < 3) {
            return res.status(400).json({ message: 'Weak password. Try again.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        user.otp = undefined;
        user.otpExpiresAt = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteUserAndTasks = async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await Auth.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await Task.deleteMany({ user: userId });

        await Auth.findByIdAndDelete(userId);

        res.status(200).json({ message: 'User and all associated tasks deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(400).json({ message: "Token missing" });
        }

        const decoded = jwt.decode(token);
        if (!decoded?.exp) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const expiry = new Date(decoded.exp * 1000);

        await BlacklistToken.create({ token, expiresAt: expiry });

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};