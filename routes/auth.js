import express from 'express';
import { signUp, login, forgotPassword, generateEmailVerificationToken, verifyEmail, resetPassword, verifyResetPassword, verifyResetPasswordByOTP } from '../controller/auth.js';
import { sendVerificationLimiter } from '../utils/index.js';
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/login', login)
router.post('/verify', sendVerificationLimiter, generateEmailVerificationToken)
router.get('/verify/:token', verifyEmail)
router.post('/reset-password', sendVerificationLimiter, forgotPassword)
router.get('/verify/reset-password/:token', verifyResetPassword)
router.post('/reset-password/otp', verifyResetPasswordByOTP)
router.post('/verify/reset-password/:token', resetPassword)
export default router;