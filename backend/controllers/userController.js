// controllers/userController.js

import User from '../models/User.js';
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// ----------------- REGISTER -----------------
const register = async (req, res) => {
  try {
    const { firstName, lastName, username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // 2️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3️⃣ Create new user
    const newUser = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // 4️⃣ Generate JWT token
    const token = jwt.sign({ userId: savedUser._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 5️⃣ Send response to frontend
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        userId: savedUser._id.toString(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        username: savedUser.username,
        email: savedUser.email,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ----------------- LOGIN -----------------
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign({ userId: user._id.toString() }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    // 4️⃣ Send response
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
  userId: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export { register, login };