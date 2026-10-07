const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [{ pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza', required: true }, quantity: { type: Number, min: 1, max: 99, required: true } }],
}, { timestamps: true })

module.exports = mongoose.model('Cart', cartSchema)