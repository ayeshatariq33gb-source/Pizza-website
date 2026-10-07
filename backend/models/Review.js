const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true, maxlength: 1000, default: '' },
}, { timestamps: true })

reviewSchema.index({ user: 1, pizza: 1 }, { unique: true })
module.exports = mongoose.model('Review', reviewSchema)