const User = require('../models/User')
const Pizza = require('../models/Pizza')
const Order = require('../models/Order')
const Review = require('../models/Review')
const Cart = require('../models/Cart')
const AppError = require('../utils/AppError')

exports.dashboard = async (request, response) => {
  const [users, pizzas, orders, pendingOrders, revenue, paidOrders, topPizzas] = await Promise.all([
    User.countDocuments(), Pizza.countDocuments(), Order.countDocuments(),
    Order.countDocuments({ status: { $nin: ['delivered', 'cancelled'] } }),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } }, { $group: { _id: null, total: { $sum: '$total' } } }]),
    Order.countDocuments({ paymentStatus: 'paid' }),
    Order.aggregate([{ $match: { status: { $ne: 'cancelled' }, paymentStatus: 'paid' } }, { $unwind: '$items' }, { $group: { _id: '$items.name', units: { $sum: '$items.quantity' }, sales: { $sum: { $multiply: ['$items.price', '$items.quantity'] } } } }, { $sort: { units: -1 } }, { $limit: 5 }]),
  ])
  response.json({ users, pizzas, orders, pendingOrders, paidOrders, revenue: revenue[0]?.total || 0, topPizzas })
}

exports.users = async (request, response) => {
  const users = await User.find().sort({ createdAt: -1 })
  response.json({ users })
}

exports.updateUser = async (request, response) => {
  const { role, name } = request.body
  const updates = {}
  if (role !== undefined) {
    if (!['customer', 'admin'].includes(role)) throw new AppError('Role must be customer or admin.')
    updates.role = role
  }
  if (name !== undefined) updates.name = name
  const user = await User.findByIdAndUpdate(request.params.id, updates, { new: true, runValidators: true })
  if (!user) throw new AppError('User not found.', 404)
  response.json({ user })
}

exports.deleteUser = async (request, response) => {
  if (request.params.id === request.user.id) throw new AppError('You cannot delete your own administrator account.')
  const user = await User.findByIdAndDelete(request.params.id)
  if (!user) throw new AppError('User not found.', 404)
  await Promise.all([Order.deleteMany({ user: user.id }), Review.deleteMany({ user: user.id }), Cart.deleteOne({ user: user.id })])
  response.json({ message: 'User deleted.' })
}