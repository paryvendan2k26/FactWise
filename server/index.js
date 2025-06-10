// FactWise/server/index.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const factRoutes = require('./routes/factRoutes'); // <--- ADD THIS LINE: Import fact routes

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// Middleware to enable CORS (allowing frontend to talk to backend)
app.use(cors());
// Middleware to parse JSON request bodies
app.use(express.json());

// Define a simple root route to check if the server is running
app.get('/', (req, res) => {
    res.send('FactWise Backend API is running!');
});

// Use Auth Routes
app.use('/api/auth', authRoutes);

// Use User Routes
app.use('/api/users', userRoutes);

// <--- ADD THIS SECTION: Use Fact Routes
app.use('/api/facts', factRoutes);
// <--- END ADDITION

// Set the port for the server to listen on.
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});