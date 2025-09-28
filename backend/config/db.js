import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Connects to MongoDB Atlas using MONGODB_URI from the .env file. (Module B2)
 */
const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("FATAL ERROR: MONGODB_URI not defined in .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('MongoDB Connected successfully.');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // Exit process if connection fails
    process.exit(1);
  }
};

export default connectDB;
