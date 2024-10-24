const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();  // Load environment variables

const connectDB = async () => {
  try {
    const MONGO_URI = process.env.HISTORY_MONGO_CLOUD_URI;
    mongoose.connect(MONGO_URI).then(() => {
      console.log(`MongoDB connected successfully to ${MONGO_URI}`);
    })
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit process if there is a failure
  }
};

module.exports = connectDB;
