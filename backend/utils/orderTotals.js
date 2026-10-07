function calculateOrderTotals(items) {
  const subtotal = Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2))
  const deliveryFee = subtotal >= 35 ? 0 : 3.5
  return { subtotal, deliveryFee, total: subtotal + deliveryFee }
}

module.exports = calculateOrderTotals