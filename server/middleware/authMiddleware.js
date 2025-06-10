// FactWise/server/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // We'll need the User model to find the user by ID

const protect = async (req, res, next) => {
  let token;

  // Check if the Authorization header is present and starts with 'Bearer'
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1]; // Format: "Bearer TOKEN"

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID from the token payload and attach to request object
      req.user = await User.findById(decoded.id).select('-password'); // Exclude password from the user object

      // If user is not found, or if token is valid but user doesn't exist anymore
      if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user not found' });
      }

      next(); // Call next middleware/route handler
    } catch (error) {
      console.error('Token verification error:', error);
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Not authorized, token expired' });
      }
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };