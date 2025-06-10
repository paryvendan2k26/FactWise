// FactWise/server/controllers/factController.js
const Fact = require('../models/Fact'); // Import the Fact model

// @desc    Create a new fact
// @route   POST /api/facts
// @access  Private (requires authentication)
exports.createFact = async (req, res) => {
  // The 'protect' middleware (from authMiddleware) will attach the user object to req.user
  // We'll use req.user.id to link the fact to the creator.
  const { title, description, claims, sources } = req.body;

  // Basic validation (more comprehensive validation can be added with libraries like Joi or Express-validator)
  if (!title || !description || !claims || claims.length === 0 || !sources || sources.length === 0) {
    return res.status(400).json({ message: 'Please provide title, description, at least one claim, and at least one source.' });
  }

  try {
    const fact = await Fact.create({
      title,
      description,
      claims,
      sources,
      user: req.user.id, // Assign the ID of the authenticated user as the creator
    });

    res.status(201).json({
      message: 'Fact created successfully',
      fact,
    });
  } catch (error) {
    console.error('Error creating fact:', error);
    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error during fact creation.' });
  }
};

// @desc    Get all facts
// @route   GET /api/facts
// @access  Public (or Private, depending on app requirements)
exports.getFacts = async (req, res) => {
  try {
    // You might want to add pagination, filtering, sorting here later
    const facts = await Fact.find().populate('user', 'username email'); // Populate user field to get username and email

    res.status(200).json({
      count: facts.length,
      data: facts,
    });
  } catch (error) {
    console.error('Error fetching facts:', error);
    res.status(500).json({ message: 'Server error fetching facts.' });
  }
};

// @desc    Get single fact by ID
// @route   GET /api/facts/:id
// @access  Public
exports.getFactById = async (req, res) => {
  try {
    const fact = await Fact.findById(req.params.id).populate('user', 'username email');

    if (!fact) {
      return res.status(404).json({ message: 'Fact not found.' });
    }

    res.status(200).json({ data: fact });
  } catch (error) {
    console.error('Error fetching single fact:', error);
    if (error.name === 'CastError') { // Handle invalid MongoDB ID format
      return res.status(400).json({ message: 'Invalid fact ID format.' });
    }
    res.status(500).json({ message: 'Server error fetching fact.' });
  }
};