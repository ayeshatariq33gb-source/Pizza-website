const jwt = require('jsonwebtoken')
const User = require('../models/User')
const asyncHandler = require('../utils/asyncHandler')
const AppError = require('../utils/AppError')

const requireAuth = asyncHandler(async (request, response, next) => {
  const token = request.headers.authorization?.startsWith('Bearer ')
    ? request.headers.authorization.slice(7)
    : null
  if (!token) throw new AppError('Sign in to continue.', 401)
  let payload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET)
  } catch {
    throw new AppError('Your session has expired. Please sign in again.', 401)
  }
  const user = await User.findById(payload.id)
  if (!user) throw new AppError('Account not found.', 401)
  request.user = user
  next()
})

const requireAdmin = (request, response, next) => {
  if (request.user?.role !== 'admin') return next(new AppError('Administrator access required.', 403))
  next()
}

module.exports = { requireAuth, requireAdmin }