// FactWise/server/routes/factRoutes.js
const express = require('express');
const { createFact, getFacts, getFactById } = require('../controllers/factController'); // Import fact controller functions
const { protect } = require('../middleware/authMiddleware'); // Import the protect middleware

const router = express.Router();

// Route for creating a new fact (protected route)
// POST /api/facts
router.post('/', protect, createFact);

// Route for getting all facts (public route, or can be protected if needed)
// GET /api/facts
router.get('/', getFacts);

// Route for getting a single fact by ID (public route)
// GET /api/facts/:id
router.get('/:id', getFactById);

module.exports = router;