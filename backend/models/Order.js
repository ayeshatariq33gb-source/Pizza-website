const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{ pizza: { type: mongoose.Schema.Types.ObjectId, ref: 'Pizza' }, name: { type: String, required: true }, price: { type: Number, required: true }, quantity: { type: Number, min: 1, required: true } }],
  deliveryAddress: { type: String, required: true, trim: true, maxlength: 500 },
  subtotal: { type: Number, required: true, min: 0 },
  deliveryFee: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentMethod: { type: String, enum: ['demo-card', 'cash-on-delivery'], default: 'cash-on-delivery' },
  paymentAmount: { type: Number, min: 0, default: 0 },
  status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], default: 'pending' },
}, { timestamps: true })

module.exports = mongoose.model('Order', orderSchema)