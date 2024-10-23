const History = require('../model/History');
const {
    getHistoryByUserId,
    saveHistory,
    deleteAllHistory,
} = require('./historyManipulation');

// Get all history by user ID
const viewHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        const history = await getHistoryByUserId(userId);
        res.status(200).json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Save a history
const saveCollaborationHistory = async (req, res) => {
    const {
        userIdOne,
        userIdTwo,
        textWritten,
        questionId,
        questionName,
        questionDifficulty,
        programmingLanguage,
        sessionDuration,
        sessionStatus,
    } = req.body;

    try {
        const history = new History({
            userIdOne,
            userIdTwo,
            textWritten,
            questionId,
            questionName,
            questionDifficulty,
            programmingLanguage,
            sessionDuration,
            sessionStatus,
        });

        await saveHistory(history);
        res.status(200).json({ message: 'History saved successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Delete all history
const deleteAllCollaborationHistory = async (req, res) => {
    try {
        await deleteAllHistory();
        res.status(200).json({ message: 'All history deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    viewHistory,
    saveCollaborationHistory,
    deleteAllCollaborationHistory,
};
