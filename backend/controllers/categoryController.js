const Category = require('../models/Category')
const Pizza = require('../models/Pizza')
const AppError = require('../utils/AppError')

exports.list = async (request, response) => {
  const categories = await Category.find({ active: true }).sort({ name: 1 })
  response.json({ categories })
}

exports.adminList = async (request, response) => {
  const categories = await Category.find().sort({ name: 1 })
  response.json({ categories })
}

exports.create = async (request, response) => {
  if (!request.body.name?.trim()) throw new AppError('Category name is required.')
  const category = await Category.create({ name: request.body.name.trim(), description: request.body.description || '' })
  response.status(201).json({ category })
}

exports.update = async (request, response) => {
  const category = await Category.findById(request.params.id)
  if (!category) throw new AppError('Category not found.', 404)
  const oldName = category.name
  if (request.body.name !== undefined) {
    const name = request.body.name.trim()
    if (!name) throw new AppError('Category name cannot be empty.')
    if (name !== oldName && await Category.exists({ name })) throw new AppError('A category with that name already exists.', 409)
    if (name !== oldName) await Pizza.updateMany({ category: oldName }, { category: name })
    category.name = name
  }
  if (request.body.description !== undefined) category.description = request.body.description
  if (request.body.active !== undefined) category.active = Boolean(request.body.active)
  await category.save()
  response.json({ category })
}

exports.remove = async (request, response) => {
  const category = await Category.findById(request.params.id)
  if (!category) throw new AppError('Category not found.', 404)
  if (await Pizza.exists({ category: category.name })) throw new AppError('Move or delete this category’s pizzas before removing it.')
  await category.deleteOne()
  response.json({ message: 'Category deleted.' })
}