const bcrypt = require('bcryptjs');
const User = require('../model/User');

// Find user by email
const findUserByEmail = async (email) => {
  return await User.findOne({ email });
};

// Find user by token
const findByToken = async (token) => {
  return await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });
};

// Find user by ID
const findUserById = async (id) => {
  return await User.findById(id);
};

// Update user by ID
const updateUserById = async (userId, updateData) => {
  return await User.findByIdAndUpdate(userId, updateData, { new: true });
};

// Save a user
const saveUser = async (user) => {
  return await user.save();
};

// Delete a user
const deleteUser = async (userId) => {
  return await User.findByIdAndDelete(userId);
};

// Get all users
const getUsers = async () => {
  return await User.find();
};

// Delete all users
const deleteAllUsers = async () => {
  await User.deleteMany({ email: { $ne: process.env.USER_EMAIL_USER } });
};

// Insert default admin data
const insertDefaultData = async () => {
  try {
    // Check if there are any users in the database
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('No users found, inserting default data...');

      // Create a default admin user
      const hashedPassword = await bcrypt.hash(process.env.USER_EMAIL_PASS, 10);
      const adminUser = new User({
        email: process.env.USER_EMAIL_USER,
        username: 'master_admin',
        password: hashedPassword,
        isAdmin: true,
      });

      await adminUser.save();
      console.log('Default admin user created.');

      // Create a default user 1
      const userHashedPassword = await bcrypt.hash('password', 10);
      const user = new User({
        email: 'test@gmail.com',
        username: 'test_user',
        password: userHashedPassword,
        isAdmin: false,
      });

      await user.save();
      console.log('Default user created.');

      // Create a default user 2
      const user2 = new User({
        email: 'test2@gmail.com',
        username: 'test_user_2',
        password: userHashedPassword,
        isAdmin: false,
      });

      await user2.save();
      console.log('Default user 2 created.');
    } else {
      console.log('Users already exist, skipping default data insertion.');
    }
  } catch (err) {
    console.error('Error inserting default data:', err.message);
  }
};

module.exports = {
  findUserByEmail,
  findByToken,
  findUserById,
  updateUserById,
  saveUser,
  deleteUser,
  getUsers,
  deleteAllUsers,
  insertDefaultData,
};
