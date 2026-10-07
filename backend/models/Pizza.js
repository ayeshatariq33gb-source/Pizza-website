const mongoose = require('mongoose')

const pizzaSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, trim: true, maxlength: 50 },
  description: { type: String, required: true, trim: true, maxlength: 500 },
  price: { type: Number, required: true, min: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  tag: { type: String, default: '', trim: true, maxlength: 40 },
  image: { type: String, default: '', trim: true },
  available: { type: Boolean, default: true },
}, { timestamps: true })

pizzaSchema.index({ name: 'text', description: 'text', category: 'text' })
module.exports = mongoose.model('Pizza', pizzaSchema)