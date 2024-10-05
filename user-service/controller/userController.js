const bcrypt = require('bcryptjs');
const User = require('../model/User');
const {
  findUserByEmail,
  findUserById,
  updateUserById,
  saveUser,
  deleteUser,
  getUsers,
  deleteAllUsers,
} = require('./userManipulation');

// Register User
const registerUser = async (req, res) => {
  const { email, username, password } = req.body;

  try {
    let user = await findUserByEmail(email);
    if (user) {
      return res.status(400).json({ message: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ email, username, password: hashedPassword, isAdmin: false });
    await saveUser(user);
    res.json({ message: 'User registered successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// View user's own Profile
const viewProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Profile not found.' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update user's own Profile
const updateProfile = async (req, res) => {
  const { username, password } = req.body;

  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    const updatedUser = await updateUserById(req.user.id, updateData);
    res.json({ message: 'Profile updated successfully.', user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a user
const deleteUserById = async (req, res) => {
  try {
    await deleteUser(req.user.id);
    res.json({ message: 'User deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await getUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete all users
const deleteUsers = async (req, res) => {
  try {
    await deleteAllUsers();
    res.json({ message: 'All users deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle a user's admin status
const toggleAdminStatus = async (req, res) => {
  const { userId, isAdmin } = req.body;

  try {
    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const updatedUser = await updateUserById(userId, { isAdmin });

    res.json({ message: `User's admin status updated to ${isAdmin}.` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  updateProfile,
  viewProfile,
  deleteUserById,
  getAllUsers,
  deleteUsers,
  toggleAdminStatus,
};
