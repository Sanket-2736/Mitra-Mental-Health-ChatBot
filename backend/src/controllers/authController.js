const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const User = require('../models/User');
const UserSummary = require('../models/UserSummary');
const logger = require('../utils/logger');

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const register = async (req, res) => {
  try {
    const { email, password, firstName, age, country } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const userId = randomUUID();

    const user = new User({
      userId,
      email,
      password,
      profile: { firstName, age, country }
    });

    await user.save();

    // Create initial user summary
    const userSummary = new UserSummary({
      userId,
      overallSummary: 'New user - first interaction',
      recentContext: 'User just registered'
    });
    await userSummary.save();

    const token = generateToken(userId);
    logger.info(`New user registered: ${email}`);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token,
      user: {
        userId,
        email,
        firstName: user.profile.firstName
      }
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user.userId);
    logger.info(`User logged in: ${email}`);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        userId: user.userId,
        email: user.email,
        firstName: user.profile.firstName
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = { register, login };
