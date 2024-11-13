const jwt = require('jsonwebtoken');
const { findUserById } = require('../controller/userManipulation')

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify the token and extract the user payload
    const user = jwt.verify(token, process.env.JWT_SECRET);

    // Load the latest user info from the database
    const dbUser = await findUserById(user.userId);
    if (!dbUser) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Attach user info to the request object
    req.user = { 
      id: dbUser._id.toString(), 
      username: dbUser.username, 
      email: dbUser.email, 
      isAdmin: dbUser.isAdmin 
    };

    next();
  } catch (err) {
    return res.status(500).json({ message: 'Internal server error' });
  }
};

const verifyIsAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}

const verifyIsOwnerOrAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    return next();
  }

  const userIdFromReqParams = req.params.id;
  const userIdFromToken = req.user.id;
  if (userIdFromReqParams === userIdFromToken) {
    return next();
  }

  return res.status(403).json({ message: "Not authorized to access this resource" });
}

module.exports = {
  authMiddleware,
  verifyIsOwnerOrAdmin,
  verifyIsAdmin,
}