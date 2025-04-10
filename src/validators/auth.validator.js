import { body, param } from "express-validator";

export const signupValidator = [
    body("name").notEmpty().withMessage("Name is required"),

    body("email")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
];

export const loginValidator = [
    body("email")
        .isEmail().withMessage("Invalid email format")
        .normalizeEmail(),

    body("password")
        .notEmpty().withMessage("Password is required")
];

export const otpValidator = [
    body("email")
        .isEmail().withMessage("Invalid email"),

    body("otp")
        .isLength({ min: 6, max: 6 })
        .withMessage("OTP must be 6 digits")
];

export const emailValidator = [
    body("email")
        .isEmail().withMessage("Invalid email")
];

export const resetPasswordValidator = [
    body('email').isEmail().withMessage('Valid email is required'),
    body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
];

export const deleteUserValidator = [
    param("userId")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID format"),
];