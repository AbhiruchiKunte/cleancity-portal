import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Internal imports
import connectDB from './config/db.js';
import uploadRoutes from './routes/upload.js';
import dataRoutes from './routes/data.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/user.js';
import authenticate from './middleware/authMiddleware.js';

// Load environment variables (Module B1)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database (Module B2)
connectDB();

// Middleware Setup (Module B1)
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 

// The __dirname part is a Node.js standard way to resolve the current directory
app.use('/uploads', express.static(path.resolve('uploads')));

// --- Routes Setup ---
app.use('/api', uploadRoutes);
app.use('/api', dataRoutes);   // Module B5: Fetch Records, Leaderboard, Hotspots
app.use('/api/admin', adminRoutes);
app.use('/api/users', userRoutes); 

// Test Route (Module B1)
app.get('/', (req, res) => {
  res.send('CleanCity Backend API Running! Check routes /api/records and /api/upload.');
});

// Start the server (Module B1)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
