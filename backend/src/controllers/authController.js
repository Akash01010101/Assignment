const User = require('../models/User');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiError = require('../utils/ApiError');

const generateToken = (id, email, role) => {
  return jwt.sign({ id, email, role }, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  });
};

const register = async (req, res) => {
  const { email, password, name } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new ApiError(409, 'User with that email already exists');
  }

  // Explicitly do not accept role from req.body
  const user = await User.create({
    email,
    password, // Virtual sets it
    name,
    role: 'user', 
  });

  const token = generateToken(user._id, user.email, user.role);

  res.status(201).json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password');
  }

  const token = generateToken(user._id, user.email, user.role);

  res.json({
    user: {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    },
    token,
  });
};

module.exports = {
  register,
  login,
};
