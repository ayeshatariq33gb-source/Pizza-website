const Pizza = require('../models/Pizza')
const Category = require('../models/Category')
const AppError = require('../utils/AppError')

exports.list = async (request, response) => {
  const categories = await Category.find({ active: true }).distinct('name')
  const filter = { available: true, category: { $in: categories } }
  if (request.query.category && request.query.category !== 'All pizzas') filter.category = request.query.category
  if (request.query.search?.trim()) filter.$text = { $search: request.query.search.trim() }
  const pizzas = await Pizza.find(filter).sort({ createdAt: 1 })
  response.json({ pizzas, categories })
}

exports.get = async (request, response) => {
  const pizza = await Pizza.findOne({ _id: request.params.id, available: true })
  if (!pizza) throw new AppError('Pizza not found.', 404)
  if (!(await Category.exists({ name: pizza.category, active: true }))) throw new AppError('Pizza not found.', 404)
  response.json({ pizza })
}

exports.create = async (request, response) => {
  if (!(await Category.exists({ name: request.body.category, active: true }))) throw new AppError('Choose an active pizza category.')
  const pizza = await Pizza.create(request.body)
  response.status(201).json({ pizza })
}

exports.update = async (request, response) => {
  if (request.body.category && !(await Category.exists({ name: request.body.category, active: true }))) throw new AppError('Choose an active pizza category.')
  const pizza = await Pizza.findByIdAndUpdate(request.params.id, request.body, { new: true, runValidators: true })
  if (!pizza) throw new AppError('Pizza not found.', 404)
  response.json({ pizza })
}

exports.remove = async (request, response) => {
  const pizza = await Pizza.findByIdAndDelete(request.params.id)
  if (!pizza) throw new AppError('Pizza not found.', 404)
  response.json({ message: 'Pizza deleted.' })
}

exports.adminList = async (request, response) => {
  const pizzas = await Pizza.find().sort({ createdAt: 1 })
  response.json({ pizzas })
}