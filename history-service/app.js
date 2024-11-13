const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const historyRoutes = require('./routes/historyRoutes');

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
app.use('/api/history', historyRoutes);

module.exports = app;
