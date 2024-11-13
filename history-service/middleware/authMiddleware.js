const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract the user payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = decoded;

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyIsAdmin = (req, res, next) => {
  if (req.decoded.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}

module.exports = {
  authMiddleware,
  verifyIsAdmin,
}