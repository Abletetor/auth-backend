import express from 'express';
import { signup, verifyEmail, loginUser, requestPasswordReset, resetPassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password/:token', resetPassword);

export default router;
