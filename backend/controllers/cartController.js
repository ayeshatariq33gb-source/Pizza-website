const Cart = require('../models/Cart')
const Pizza = require('../models/Pizza')
const AppError = require('../utils/AppError')

async function getCart(userId) {
  let cart = await Cart.findOne({ user: userId }).populate('items.pizza')
  if (!cart) cart = await Cart.create({ user: userId, items: [] })
  return cart
}

exports.get = async (request, response) => response.json({ cart: await getCart(request.user.id) })

exports.add = async (request, response) => {
  const { pizzaId, quantity = 1 } = request.body
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new AppError('Quantity must be between 1 and 99.')
  const pizza = await Pizza.findOne({ _id: pizzaId, available: true })
  if (!pizza) throw new AppError('Pizza not found or unavailable.', 404)
  const cart = await Cart.findOneAndUpdate({ user: request.user.id, 'items.pizza': pizzaId }, { $inc: { 'items.$.quantity': quantity } }, { new: true })
  if (cart) return response.json({ cart: await cart.populate('items.pizza') })
  const newCart = await Cart.findOneAndUpdate({ user: request.user.id }, { $push: { items: { pizza: pizzaId, quantity } } }, { new: true, upsert: true, setDefaultsOnInsert: true })
  response.json({ cart: await newCart.populate('items.pizza') })
}

exports.update = async (request, response) => {
  const quantity = Number(request.body.quantity)
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) throw new AppError('Quantity must be between 1 and 99.')
  const cart = await Cart.findOneAndUpdate({ user: request.user.id, 'items.pizza': request.params.pizzaId }, { $set: { 'items.$.quantity': quantity } }, { new: true }).populate('items.pizza')
  if (!cart) throw new AppError('Cart item not found.', 404)
  response.json({ cart })
}

exports.remove = async (request, response) => {
  const cart = await Cart.findOneAndUpdate({ user: request.user.id }, { $pull: { items: { pizza: request.params.pizzaId } } }, { new: true }).populate('items.pizza')
  response.json({ cart: cart || { items: [] } })
}

exports.clear = async (request, response) => {
  const cart = await Cart.findOneAndUpdate({ user: request.user.id }, { $set: { items: [] } }, { new: true, upsert: true }).populate('items.pizza')
  response.json({ cart })
}