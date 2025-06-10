// FactWise/server/controllers/authController.js
const User = require('../models/User');
const bcrypt = require('bcryptjs'); // Already used in User model, but good to have here if needed for direct comparison outside model method
const jwt = require('jsonwebtoken');

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists by email or username
    let userByEmail = await User.findOne({ email });
    if (userByEmail) {
      return res.status(400).json({ message: 'User with that email already exists.' });
    }
    let userByUsername = await User.findOne({ username });
    if (userByUsername) {
      return res.status(400).json({ message: 'User with that username already exists.' });
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password, // Password will be hashed by the pre-save hook in the User model
    });

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // Token expires in 1 hour
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};