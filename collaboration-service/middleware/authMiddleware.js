const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user; // Attach user profile to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized' }); // Send a 401 response if
  }
};

const authMiddlewareSocket = async (token) => {
  try {
    const user = jwt.verify(token.split(' ')[1], JWT_SECRET);
    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  authMiddleware,
  authMiddlewareSocket,
};
