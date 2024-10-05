import mongoose from 'mongoose';

const { Schema } = mongoose;

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
    }
});

export default mongoose.model('Question', QuestionSchema);
