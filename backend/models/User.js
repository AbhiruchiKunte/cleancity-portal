// models/User.ts
import mongoose from "mongoose";

// Define the user schema
const UserSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, { 
  timestamps: true 
});

const User = mongoose.model("User", UserSchema);
export default User;
