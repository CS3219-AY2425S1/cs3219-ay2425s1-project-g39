const express = require('express');
const {
  registerUser,
  updateProfile,
  viewProfile,
  getAllUsers,
  deleteUserById,
  deleteUsers,
  toggleAdminStatus,
} = require('../controller/userController');
const {
  authMiddleware,
  verifyIsOwnerOrAdmin,
  verifyIsAdmin
 } = require('../middleware/authMiddleware');

const router = express.Router();

// Registration route
router.post('/register', registerUser);

// Change username and password route
router.put('/profile', authMiddleware, updateProfile);

// View profile route
router.get('/profile', authMiddleware, viewProfile);

// Get all users route (only for admin)
router.get('/profiles', authMiddleware, verifyIsAdmin, getAllUsers);

// Delete user route (only for admin or the user itself)
router.delete('/profile/:id', authMiddleware, verifyIsOwnerOrAdmin, deleteUserById);

// Delete all users route (only for admin)
router.delete('/profiles', authMiddleware, verifyIsAdmin, deleteUsers);

// Toggle admin status (only for admin)
router.put('/promote', authMiddleware, verifyIsAdmin, toggleAdminStatus);

module.exports = router;
