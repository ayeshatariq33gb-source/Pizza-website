const User = require('../models/User')
const AppError = require('../utils/AppError')

exports.profile = async (request, response) => response.json({ user: request.user })

exports.updateProfile = async (request, response) => {
  const allowed = {}
  if (typeof request.body.name === 'string') allowed.name = request.body.name.trim()
  if (typeof request.body.email === 'string') allowed.email = request.body.email.trim().toLowerCase()
  if (request.body.password) {
    if (request.body.password.length < 8) return response.status(400).json({ message: 'Password must be at least 8 characters.' })
    allowed.password = request.body.password
  }
  const user = await User.findById(request.user.id)
  if (!user) throw new AppError('Account not found.', 404)
  Object.assign(user, allowed)
  await user.save()
  response.json({ user })
}