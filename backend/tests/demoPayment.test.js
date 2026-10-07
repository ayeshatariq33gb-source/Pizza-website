const test = require('node:test')
const assert = require('node:assert/strict')
const resolveDemoPayment = require('../utils/demoPayment')

test('demo payment tokens resolve to paid or failed without card data', () => {
  assert.equal(resolveDemoPayment('demo-approved'), 'paid')
  assert.equal(resolveDemoPayment('demo-declined'), 'failed')
  assert.equal(resolveDemoPayment('4242 4242 4242 4242'), null)
  assert.equal(resolveDemoPayment(undefined), null)
})