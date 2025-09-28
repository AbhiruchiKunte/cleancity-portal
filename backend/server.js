import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';

// Internal imports
import connectDB from './config/db.js';
import uploadRoutes from './routes/upload.js';
import dataRoutes from './routes/data.js';
import adminRoutes from './routes/admin.js';

// Load environment variables (Module B1)
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Database (Module B2)
connectDB();

// Middleware Setup (Module B1)
app.use(cors()); // Enable CORS for client requests
app.use(express.json()); // Body parser for JSON
app.use(express.urlencoded({ extended: true })); // Body parser for form data

// Serve static uploaded files (important for the client to view the images)
// Assuming the client knows the image_url path (e.g., /uploads/image-123.jpg)
// The __dirname part is a Node.js standard way to resolve the current directory
app.use('/uploads', express.static(path.resolve('uploads')));

// --- Routes Setup ---
app.use('/api', uploadRoutes); // Module B4: Upload and Classification
app.use('/api', dataRoutes);   // Module B5: Fetch Records, Leaderboard, Hotspots
app.use('/api/admin', adminRoutes); // Module B6: Admin APIs

// Test Route (Module B1)
app.get('/', (req, res) => {
  res.send('CleanCity Backend API Running! Check routes /api/records and /api/upload.');
});

// Start the server (Module B1)
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test Route: http://localhost:${PORT}/`);
});
