const crypto = require('crypto');
const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Generate JWT token
const generateToken = (userId) =>
  jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });

// Safe user payload (never expose password hash)
const userPayload = (user) => ({
  id: user._id,
  username: user.username,
  email: user.email,
});

// ─── Register ────────────────────────────────────────────────────────────────
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    // Let the DB unique index + Mongoose validation handle duplicates.
    // No pre-check needed (avoids TOCTOU race and an extra round-trip).
    const user = await new User({ username, email, password }).save();
    const token = generateToken(user._id);

    return res.status(201).json({ token, user: userPayload(user) });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    if (error.name === 'ValidationError') {
      const details = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: 'Validation error', details });
    }
    console.error('Registration error:', error.message);
    return res.status(500).json({ error: 'Failed to register user' });
  }
};

// ─── Login ───────────────────────────────────────────────────────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      // Single response — no distinction between "not found" vs "wrong password"
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken(user._id);
    return res.json({ token, user: userPayload(user) });
  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({ error: 'Failed to login' });
  }
};

// ─── Forgot Password ─────────────────────────────────────────────────────────
const forgotPassword = async (req, res) => {
  // Always return the same message to prevent user enumeration
  const genericResponse = { message: 'If that email is registered, a reset link has been sent.' };

  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.json(genericResponse);
    }

    // Generate a raw token, store only its hash
    const rawToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 3_600_000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password/${rawToken}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset',
      text: `Click the link to reset your password (expires in 1 hour):\n\n${resetUrl}`,
    });

    return res.json(genericResponse);
  } catch (error) {
    console.error('Forgot password error:', error.message);
    return res.status(500).json({ error: 'Failed to send reset email' });
  }
};

// ─── Reset Password ───────────────────────────────────────────────────────────
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' });
    }

    // Look up by the hash of the incoming raw token
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error.message);
    return res.status(500).json({ error: 'Failed to reset password' });
  }
};

module.exports = { register, login, forgotPassword, resetPassword };