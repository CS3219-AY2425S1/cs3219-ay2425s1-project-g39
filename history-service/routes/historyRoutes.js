const express = require('express');
const {
    viewHistory,
    saveCollaborationHistory,
    deleteAllCollaborationHistory,
} = require('../controller/historyController');

const router = express.Router();

// Get all history by user ID
router.get('/:userId', viewHistory);

// Save a history
router.post('/', saveCollaborationHistory);

// Delete all history
router.delete('/', deleteAllCollaborationHistory);

module.exports = router;
