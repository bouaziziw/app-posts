const express = require('express');
const { register, login, forgotPassword, resetPassword } = require('../controllers/auth.controller');
const router = express.Router();

// Register route
router.post('/register', register);

// Login route
router.post('/login', login);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password', resetPassword);

module.exports = router;