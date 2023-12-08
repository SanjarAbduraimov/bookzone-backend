const express = require('express');
const { signUp, login, forgotPassword, generateEmailVerificationToken, verifyEmail, resetPassword, verifyResetPassword } = require('../controller/auth');
const { sendVerificationLimiter } = require('../utils');
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/login', login)
router.post('/auth/verify', sendVerificationLimiter, generateEmailVerificationToken)
router.get('/auth/verify/:token', verifyEmail)
// router.get('/auth/verify/forget-password/:token', verifyForgotPassword)
router.post('/auth/reset-password/request', sendVerificationLimiter, forgotPassword)
router.get('/auth/verify/reset-password/:token', verifyResetPassword)
router.post('/auth/verify/reset-password/:token', resetPassword)
module.exports = router;