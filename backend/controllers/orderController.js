const Cart = require('../models/Cart')
const Order = require('../models/Order')
const AppError = require('../utils/AppError')
const calculateOrderTotals = require('../utils/orderTotals')
const resolveDemoPayment = require('../utils/demoPayment')

exports.place = async (request, response) => {
  const deliveryAddress = request.body.deliveryAddress?.trim()
  if (!deliveryAddress || deliveryAddress.length < 8) throw new AppError('Enter a complete delivery address.')
  const cart = await Cart.findOne({ user: request.user.id }).populate('items.pizza')
  if (!cart?.items.length) throw new AppError('Your cart is empty.')
  const items = cart.items.filter((item) => item.pizza?.available).map(({ pizza, quantity }) => ({ pizza: pizza._id, name: pizza.name, price: pizza.price, quantity }))
  if (!items.length) throw new AppError('The items in your cart are no longer available.')
  const totals = calculateOrderTotals(items)
  const paymentMethod = request.body.paymentMethod || 'cash-on-delivery'
  if (!['demo-card', 'cash-on-delivery'].includes(paymentMethod)) throw new AppError('Choose card or cash on delivery.')
  let paymentStatus = 'pending'
  if (paymentMethod === 'demo-card') {
    paymentStatus = resolveDemoPayment(request.body.demoPaymentToken)
    if (!paymentStatus) throw new AppError('Demo payment token is invalid.')
  }
  const order = await Order.create({
    user: request.user.id,
    items,
    deliveryAddress,
    ...totals,
    paymentMethod,
    paymentStatus,
    paymentAmount: paymentStatus === 'paid' ? totals.total : 0,
  })
  cart.items = []
  await cart.save()
  response.status(201).json({ order })
}

exports.history = async (request, response) => {
  const orders = await Order.find({ user: request.user.id }).sort({ createdAt: -1 })
  response.json({ orders })
}

exports.adminList = async (request, response) => {
  const orders = await Order.find().populate('user', 'name email').sort({ createdAt: -1 })
  response.json({ orders })
}

exports.updateStatus = async (request, response) => {
  const statuses = ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled']
  if (!statuses.includes(request.body.status)) throw new AppError(`Status must be one of: ${statuses.join(', ')}.`)
  const order = await Order.findByIdAndUpdate(request.params.id, { status: request.body.status }, { new: true, runValidators: true })
  if (!order) throw new AppError('Order not found.', 404)
  response.json({ order })
}

exports.active = async (request, response) => {
  const orders = await Order.find({ user: request.user.id, status: { $nin: ['delivered', 'cancelled'] } }).sort({ createdAt: -1 })
  response.json({ orders })
}

exports.updatePayment = async (request, response) => {
  if (!['pending', 'paid', 'failed'].includes(request.body.paymentStatus)) throw new AppError('Payment status must be pending, paid, or failed.')
  const order = await Order.findById(request.params.id)
  if (!order) throw new AppError('Order not found.', 404)
  order.paymentStatus = request.body.paymentStatus
  order.paymentAmount = order.paymentStatus === 'paid' ? order.total : 0
  await order.save()
  response.json({ order })
}

exports.retryDemoPayment = async (request, response) => {
  const order = await Order.findOne({ _id: request.params.id, user: request.user.id })
  if (!order) throw new AppError('Order not found.', 404)
  if (order.paymentMethod !== 'demo-card') throw new AppError('Only demo card orders can retry payment.')
  if (!['failed', 'pending'].includes(order.paymentStatus)) throw new AppError('This order is already paid.')
  const paymentStatus = resolveDemoPayment(request.body.demoPaymentToken)
  if (!paymentStatus) throw new AppError('Demo payment token is invalid.')
  order.paymentStatus = paymentStatus
  order.paymentAmount = paymentStatus === 'paid' ? order.total : 0
  await order.save()
  response.json({ order })
}