const express = require('express');
const {
  authMiddleware,
  verifyIsOwnerOrAdmin,
} = require('../middleware/authMiddleware');

const router = express.Router();

// Validate token route
router.get('/validate-token', authMiddleware, (req, res) => {
  res.status(200).json({ message: 'Token is valid'});
});

// Validate admin route
router.get(
  '/validate-admin',
  authMiddleware,
  verifyIsOwnerOrAdmin,
  (req, res) => {
    res.status(200).json({ message: 'Admin access granted' });
  },
);

module.exports = router;
