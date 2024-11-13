import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];
    const user = jwt.verify(token, JWT_SECRET);
    req.user = user;
    next();
  } catch (error) {
    console.log(error)
    return res.status(401).json({ message: 'Unauthorized' });
  }
};

export const authMiddlewareAdmin = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'No permission' });
  }
  next();
};