const test = require('node:test')
const assert = require('node:assert/strict')
const calculateOrderTotals = require('../utils/orderTotals')

test('charges delivery below the free-delivery threshold', () => {
  assert.deepEqual(calculateOrderTotals([{ price: 16, quantity: 1 }]), {
    subtotal: 16,
    deliveryFee: 3.5,
    total: 19.5,
  })
})

test('waives delivery at the free-delivery threshold', () => {
  assert.deepEqual(calculateOrderTotals([{ price: 20, quantity: 1 }, { price: 15, quantity: 1 }]), {
    subtotal: 35,
    deliveryFee: 0,
    total: 35,
  })
})