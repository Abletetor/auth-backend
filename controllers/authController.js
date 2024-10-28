import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { generateVerificationToken, generateResetToken } from '../utils/tokenUtils.js';
import { sendVerificationEmail } from '../utils/emailUtils.js';
import { sendPasswordResetEmail } from '../utils/passwordResetEmail.js';

export const signup = async (req, res) => {
   const { name, email, password } = req.body;
   try {
      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ message: 'User already exists' });

      const newUser = new User({ name, email, password });
      await newUser.save();

      const token = generateVerificationToken(newUser._id);
      await sendVerificationEmail(newUser, token);

      res.status(201).json({ message: 'User registered successfully. Please verify your email.' });
   } catch (error) {
      res.status(500).json({ message: 'Error registering user' });
   }
};

// Email Verification
export const verifyEmail = async (req, res) => {
   const { token } = req.query;
   try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);
      if (!user) return res.status(400).json({ message: 'Invalid token' });

      user.isVerified = true;
      await user.save();

      res.status(200).json({ message: 'Email verified successfully' });
   } catch (error) {
      res.status(400).json({ message: 'Invalid or expired token' });
   }
};

// Login user
export const loginUser = async (req, res) => {
   const { email, password } = req.body;

   if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
   }

   try {
      const user = await User.findOne({ email });
      if (!user) {
         return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(401).json({ message: 'Invalid email or password.' });
      }

      // Create and assign a JWT
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.status(200).json({
         message: 'Login successful.',
         token,
         user: { id: user._id, name: user.name, email: user.email, role: user.role },
      });
   } catch (error) {
      res.status(500).json({ message: 'An error occurred. Please try again.' });
   }
};

// Request Password Reset
export const requestPasswordReset = async (req, res) => {
   const { email } = req.body;
   try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'User not found' });

      const resetToken = generateResetToken(user._id);
      await sendPasswordResetEmail(user, resetToken);

      res.status(200).json({ message: 'Password reset email sent successfully' });
   } catch (error) {
      res.status(500).json({ error: 'Failed to send password reset email' });
   }
};

// Reset Password
export const resetPassword = async (req, res) => {
   const { token } = req.params;
   const { password } = req.body;

   if (!token) {
      return res.status(400).json({ error: 'Token is required' });
   }

   try {
      // Verify the token and extract userId
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by userId from token
      const user = await User.findById(decoded.userId);
      if (!user) {
         return res.status(404).json({ error: 'User not found' });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Use updateOne to update password without triggering the pre-save hook
      await User.updateOne({ _id: user._id }, { password: hashedPassword });

      res.status(200).json({ message: 'Password reset successful' });
   } catch (error) {
      res.status(400).json({ error: 'Invalid or expired token' });
   }
};










