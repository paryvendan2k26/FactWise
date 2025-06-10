// FactWise/server/routes/userRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

const router = express.Router();

// @desc    Get user profile (example of a protected route)
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, (req, res) => {
  // req.user will be available here due to the 'protect' middleware
  if (req.user) {
    res.json({
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      message: `Welcome, ${req.user.username}! This is your protected profile.`,
    });
  } else {
    res.status(404).json({ message: 'User not found.' }); // Should ideally not happen if protect works
  }
});

module.exports = router;