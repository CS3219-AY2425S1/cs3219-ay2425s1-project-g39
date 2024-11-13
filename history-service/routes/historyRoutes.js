const express = require('express');
const {
    viewHistory,
    saveCollaborationHistory,
    deleteAllCollaborationHistory,
    viewProgress,
} = require('../controller/historyController');
const {
    authMiddleware,
    verifyIsAdmin
} = require('../middleware/authMiddleware');

const router = express.Router();

// Get all history by user ID
router.get('/:userId', authMiddleware, viewHistory);

// Save a history
router.post('/', authMiddleware, saveCollaborationHistory);

// Delete all history
router.delete('/', authMiddleware, verifyIsAdmin, deleteAllCollaborationHistory);

// View progress history
router.get('/progress/:userId', authMiddleware, viewProgress);

module.exports = router;
