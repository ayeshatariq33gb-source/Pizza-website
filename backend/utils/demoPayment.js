const outcomes = Object.freeze({
  'demo-approved': 'paid',
  'demo-declined': 'failed',
})

function resolveDemoPayment(token) {
  return outcomes[token] || null
}

module.exports = resolveDemoPayment