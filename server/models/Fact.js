// FactWise/server/models/Fact.js
const mongoose = require('mongoose');

const FactSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title for the fact'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description for the fact'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  claims: [
    {
      claimText: {
        type: String,
        required: [true, 'Claim text is required'],
        maxlength: [500, 'Claim text cannot be more than 500 characters']
      },
      // You might add fields like 'status' (e.g., 'unverified', 'verified', 'disputed') here later
      // And references to evidence/sources for this specific claim
    }
  ],
  sources: [
    {
      sourceUrl: {
        type: String,
        required: [true, 'Source URL is required'],
        match: [
          /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
          'Please use a valid URL for the source'
        ]
      },
      // Optional: A brief description of the source
      sourceDescription: {
        type: String,
        maxlength: [200, 'Source description cannot be more than 200 characters']
      }
    }
  ],
  // Reference to the User who created this fact
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // Refers to the 'User' model
    required: true
  },
  // Basic metrics (can be populated by other features later)
  upvotes: {
    type: Number,
    default: 0
  },
  downvotes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Fact', FactSchema);