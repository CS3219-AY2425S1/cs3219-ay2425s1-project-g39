const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userIdOne: { type: String, required: true },
  userIdTwo: { type: String, required: true },
  textWritten: { type: String, required: true },
  questionId: { type: String, required: true },
  questionName: { type: String, required: true },
  questionDifficulty: { type: String, required: true },
  programmingLanguage: { type: String, required: true },
  datetime: { type: Date, default: Date.now },
  sessionDuration: { type: Number }, // in minutes
  sessionStatus: { type: String, enum: ['completed', 'interrupted'], default: 'completed' },
});

const History = mongoose.model('History', HistorySchema);

module.exports = History;
