const ContactMessage = require('../models/ContactMessage')
const AppError = require('../utils/AppError')

exports.create = async (request, response) => {
  const { name, email, message } = request.body
  if (!name?.trim() || !/^\S+@\S+\.\S+$/.test(email || '') || !message?.trim()) {
    throw new AppError('Enter your name, a valid email, and a message.')
  }
  const contactMessage = await ContactMessage.create({ name, email, message })
  response.status(201).json({ message: 'Your message has been received.', contactMessage: { id: contactMessage.id } })
}

exports.adminList = async (request, response) => {
  const messages = await ContactMessage.find().sort({ createdAt: -1 })
  response.json({ messages })
}

exports.update = async (request, response) => {
  if (!['new', 'read', 'resolved'].includes(request.body.status)) throw new AppError('Message status must be new, read, or resolved.')
  const message = await ContactMessage.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true })
  if (!message) throw new AppError('Contact message not found.', 404)
  response.json({ message })
}

exports.remove = async (request, response) => {
  const message = await ContactMessage.findByIdAndDelete(request.params.id)
  if (!message) throw new AppError('Contact message not found.', 404)
  response.json({ message: 'Contact message deleted.' })
}