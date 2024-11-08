const https = require('https');
const History = require('../model/History');
const {
    getHistoryByUserId,
    saveHistory,
    deleteAllHistory,
} = require('./historyManipulation');

// Fetch questions from the question service
const fetchQuestions = async (req) => {
    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    const { default: fetch } = await import('node-fetch');

    const response = await fetch("https://nginx/api/questions/all", {
        method: 'GET',
        headers: {
            'Authorization': req.header('Authorization'),
            'Content-Type': 'application/json',
        },
        agent: agent,
    });

    if (!response.ok) {
        throw new Error('Failed to fetch questions');
    }

    return response.json();
};

// Get all history by user ID
const viewHistory = async (req, res) => {
    try {
        const { userId } = req.params;
        if (req.decoded.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }
        const history = await getHistoryByUserId(userId);

        const questions = await fetchQuestions(req);

        const enrichedHistory = history.map(hist => {
            const relatedQuestion = questions.find(q => q.id === hist.questionId);

            return {
                userIdOne: hist.userIdOne,
                userIdTwo: hist.userIdTwo,
                textWritten: hist.textWritten,
                questionId: hist.questionId,
                programmingLanguage: hist.programmingLanguage,
                sessionDuration: hist.sessionDuration,
                sessionStatus: hist.sessionStatus,
                datetime: hist.datetime,
                questionName: relatedQuestion?.title || 'Unknown Question Name',
                questionDifficulty: relatedQuestion?.difficulty || 'Unknown Difficulty',
            };
        });

        res.json(enrichedHistory);
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
        programmingLanguage,
    } = req.body;

    try {
        const history = new History({
            userIdOne,
            userIdTwo,
            textWritten,
            questionId,
            programmingLanguage
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

// View progress history
const viewProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        if (req.decoded.userId !== userId) {
            return res.status(403).json({ message: 'Not authorized to access this resource' });
        }

        const history = await getHistoryByUserId(userId);

        const questions = await fetchQuestions(req);

        // Initialize counts for difficulties
        const difficultyCount = {
            Easy: { completed: 0, total: 0 },
            Medium: { completed: 0, total: 0 },
            Hard: { completed: 0, total: 0 },
        };

        const completedQuestionIds = new Set();
        const topicCount = {}; // Object to track counts for each topic

        // Collect completed question IDs
        history.forEach(entry => {
            if (entry.sessionStatus === 'completed') {
                completedQuestionIds.add(Number(entry.questionId));
            }
        });

        // Count total questions by difficulty and initialize topic counts
        questions.forEach(question => {
            const difficulty = question.difficulty;
            if (difficultyCount[difficulty] !== undefined) {
                difficultyCount[difficulty].total++;
            }

            // Initialize topic count if it doesn't exist
            question.topics.forEach(topic => {
                if (!topicCount[topic]) {
                    topicCount[topic] = 0;
                }
            });
        });

        // Count completed questions by difficulty and topic
        completedQuestionIds.forEach(questionId => {
            const question = questions.find(q => q.id === questionId);
            if (question) {
                const difficulty = question.difficulty;
                if (difficultyCount[difficulty] !== undefined) {
                    difficultyCount[difficulty].completed++;
                }

                // Count the completed questions for each topic
                question.topics.forEach(topic => {
                    if (topicCount[topic] !== undefined) {
                        topicCount[topic]++;
                    }
                });
            }
        });

        // Get top topics sorted by completed question count, ensuring no zero counts
        const topTopics = Object.entries(topicCount)
            .filter(([, count]) => count > 0) // Keep only topics with a count > 0
            .sort((a, b) => b[1] - a[1]) // Sort by count descending
            .slice(0, 3) // Get top 3
            .map(([topic, count]) => ({ topic, count })); // Map to desired format

        // Return the result including difficulty counts and top topics
        res.status(200).json({ difficultyCount, topTopics });

    } catch (err) {
        console.error(err); // Log the error for debugging
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    viewHistory,
    saveCollaborationHistory,
    deleteAllCollaborationHistory,
    viewProgress,
};
