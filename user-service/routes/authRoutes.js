const express = require('express');
const {
  loginUser,
  forgotPassword,
  resetPassword,
} = require('../controller/authController');

const router = express.Router();

// Login route
router.post('/login', loginUser);

// Forgot password route
router.post('/forgot-password', forgotPassword);

// Reset password route
router.post('/reset-password/:token', resetPassword);

module.exports = router;
