import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: [true, 'User email is required'],
            unique: true,
            trim: true,
            lowercase: true,
            match: [/\S+@\S+\.\S+/, 'Please enter a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'User password is required'],
            minlength: 6,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        lastOtpSentAt: {
            type: Date,
            default: null
        },
        otp: String,
        otpExpiresAt: Date
    },
    {
        timestamps: true,
    }
);

const Auth = mongoose.model("Auth", authSchema);

export default Auth;
