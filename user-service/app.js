const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const verifyRoutes = require('./routes/verificationRoutes');
const User = require('./model/User');

// Initialize Express app
const app = express();

// Load environment variables
require('dotenv').config();

// Connect to database
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Handle CORS
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
    return res.status(200).json({});
  }

  next();
});

// Routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verify', verifyRoutes);

// Health check route
app.get('/', (req, res) => {
  res.status(200).json({ status: 'Hello from user service.' });
});

// Route to get all users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

// Route to delete all users
app.delete('/users', async (req, res) => {
  try {
    await User.deleteMany({ email: { $ne:  process.env.EMAIL_USER } });
    res.json({ message: 'All users except main account deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = app;
