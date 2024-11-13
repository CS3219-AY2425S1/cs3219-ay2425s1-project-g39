const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const {
  findUserByEmail,
  updateUserById,
  findByToken,
} = require('./userManipulation');

// Login User
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Update last login time
    user.lastLogin = new Date();
    await updateUserById(user._id, { lastLogin: user.lastLogin });

    const token = jwt.sign(
      { userId: user._id, isAdmin: user.isAdmin, username: user.username },
      process.env.JWT_SECRET,
      {
        expiresIn: '1y',
      },
    );
    res.json({ token: token, userId: user._id.toString(), user: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res
        .status(400)
        .json({ message: 'No account with that email exists.' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
    await updateUserById(user._id.toString(), {
      resetPasswordToken: user.resetPasswordToken,
      resetPasswordExpires: user.resetPasswordExpires,
    });

    // Send reset email
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USER_EMAIL_USER,
        pass: process.env.USER_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
             Please click on the following link, or paste this into your browser to complete the process:\n\n
             ${process.env.DOMAIN_NAME}/reset-password/${resetToken}\n\n
             If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err) => {
      if (err) {
        return res.status(500).json({ message: 'Error sending email.' });
      }
      res.json({ message: 'Password reset email sent.' });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { password } = req.body;
  const token = req.params.token;

  try {
    const user = await findByToken(token);
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Password reset token is invalid or has expired.' });
    }

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await updateUserById(user._id.toString(), { password: user.password });

    res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Verify Token
const handleVerifyToken = async (req, res) => {
  try {
    const verifiedUser = req.user;
    return res
      .status(200)
      .json({ message: 'Token verified', data: verifiedUser });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

module.exports = {
  loginUser,
  forgotPassword,
  resetPassword,
  handleVerifyToken,
};
