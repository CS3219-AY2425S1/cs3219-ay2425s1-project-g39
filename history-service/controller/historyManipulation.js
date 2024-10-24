const History = require('../model/History');

// Save a history
const saveHistory = async (history) => {
  return await history.save();
};

// Get all history by user ID
const getHistoryByUserId = async (userId) => {
  return await History.find({
    $or: [
      { userIdOne: userId },
      { userIdTwo: userId }
    ]
  }).sort({ datetime: -1 });
};

// Delete all history
const deleteAllHistory = async () => {
  return await History.deleteMany();
};

module.exports = {
  saveHistory,
  getHistoryByUserId,
  deleteAllHistory,
};
