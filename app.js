import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';

dotenv.config();
const app = express();

// Connect Database
connectDB();

// Middleware
app.use(express.json());
app.use(cors({
   origin: process.env.CLIENT_URL,
   credentials: true,
}));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
