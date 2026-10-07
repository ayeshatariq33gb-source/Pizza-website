const jwt = require('jsonwebtoken')
const User = require('../models/User')
const AppError = require('../utils/AppError')

function issueToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' })
}

exports.register = async (request, response) => {
  const { name, email, password } = request.body
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !password || password.length < 8) {
    throw new AppError('Enter your name, a valid email, and a password of at least 8 characters.')
  }
  const user = await User.create({ name, email, password })
  response.status(201).json({ token: issueToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}

exports.login = async (request, response) => {
  const { email, password } = request.body
  const user = await User.findOne({ email: String(email || '').toLowerCase().trim() }).select('+password')
  if (!user || !password || !(await user.comparePassword(password))) throw new AppError('Email or password is incorrect.', 401)
  response.json({ token: issueToken(user), user: { id: user.id, name: user.name, email: user.email, role: user.role } })
}