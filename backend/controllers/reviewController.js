const Review = require('../models/Review')
const Pizza = require('../models/Pizza')
const AppError = require('../utils/AppError')

exports.list = async (request, response) => {
  const filter = request.query.pizzaId ? { pizza: request.query.pizzaId } : {}
  const reviews = await Review.find(filter).populate('user', 'name').populate('pizza', 'name').sort({ createdAt: -1 })
  response.json({ reviews })
}

exports.create = async (request, response) => {
  const { pizzaId, rating, comment = '' } = request.body
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) throw new AppError('Rating must be a whole number from 1 to 5.')
  if (!(await Pizza.exists({ _id: pizzaId }))) throw new AppError('Pizza not found.', 404)
  const review = await Review.create({ user: request.user.id, pizza: pizzaId, rating, comment })
  const aggregate = await Review.aggregate([{ $match: { pizza: review.pizza } }, { $group: { _id: '$pizza', rating: { $avg: '$rating' } } }])
  await Pizza.findByIdAndUpdate(pizzaId, { rating: Number(aggregate[0].rating.toFixed(1)) })
  response.status(201).json({ review: await review.populate('user', 'name') })
}

exports.remove = async (request, response) => {
  const review = await Review.findById(request.params.id)
  if (!review) throw new AppError('Review not found.', 404)
  if (review.user.toString() !== request.user.id && request.user.role !== 'admin') throw new AppError('You can only remove your own review.', 403)
  const pizzaId = review.pizza
  await review.deleteOne()
  const [aggregate] = await Review.aggregate([{ $match: { pizza: pizzaId } }, { $group: { _id: '$pizza', rating: { $avg: '$rating' } } }])
  await Pizza.findByIdAndUpdate(pizzaId, { rating: aggregate ? Number(aggregate.rating.toFixed(1)) : 0 })
  response.json({ message: 'Review deleted.' })
}