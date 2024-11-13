import mongoose from 'mongoose';

const { Schema } = mongoose;

const TestCaseSchema = new Schema(
  {
    input: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { _id: false },
); // Disable the automatic creation of an _id for each subdocument

const QuestionSchema = new Schema({
  id: {
    type: Number,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  topics: {
    type: [String],
    required: true,
  },
  difficulty: {
    type: String,
    required: true,
  },
  images: {
    type: [String],
    required: false,
  },
  testCases: {
    type: [TestCaseSchema],
    required: false, // Set to true if you want to require test cases
  },
});

export default mongoose.model('Question', QuestionSchema);
