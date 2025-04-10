import express from 'express';
import { signup, verifyOtp, login, resendOtp, forgotPassword, resetPassword, deleteUserAndTasks, logout } from '../controllers/auth.controller.js';
import validate from '../middlewares/validate.middleware.js';
import { signupValidator, loginValidator, otpValidator, emailValidator, resetPasswordValidator, deleteUserValidator } from '../validators/auth.validator.js';
import authorize from '../middlewares/authorize.middleware.js';

const authRouter = express.Router();

authRouter.post('/signup', signupValidator, validate, signup);
authRouter.post('/resend-otp', emailValidator, validate, resendOtp);
authRouter.post('/verify-otp', otpValidator, validate, verifyOtp);
authRouter.post('/login', loginValidator, validate, login);
authRouter.post('/forgot-password', emailValidator, validate, forgotPassword);
authRouter.post('/reset-password', resetPasswordValidator, validate, resetPassword);
authRouter.delete('/delete/:userId', deleteUserValidator, validate, deleteUserAndTasks);
authRouter.post('/logout', authorize, logout);

export default authRouter;