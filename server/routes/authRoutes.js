// FactWise/server/routes/authRoutes.js
const express = require('express');
const { register, login } = require('../controllers/authController'); // <--- Path should now be correct

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

module.exports = router;