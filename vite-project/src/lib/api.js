const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function request(path, options = {}) {
  const token = localStorage.getItem('pizza-token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  })
  const data = response.status === 204 ? {} : await response.json()
  if (!response.ok) throw new Error(data.message || 'The request could not be completed.')
  return data
}

function normalizePizza(pizza) {
  return { ...pizza, id: pizza.id || pizza._id, rating: String(pizza.rating ?? 0) }
}

export const api = {
  request,
  async pizzas(params = {}) {
    const query = new URLSearchParams(params).toString()
    const result = await request(`/pizzas${query ? `?${query}` : ''}`)
    return { ...result, pizzas: result.pizzas.map(normalizePizza) }
  },
  async login(credentials) {
    return request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) })
  },
  async register(details) {
    return request('/auth/register', { method: 'POST', body: JSON.stringify(details) })
  },
  async cart() {
    const { cart } = await request('/cart')
    return cart.items.filter((item) => item.pizza).map((item) => ({ ...normalizePizza(item.pizza), quantity: item.quantity }))
  },
  addCartItem(pizzaId, quantity = 1) {
    return request('/cart/items', { method: 'POST', body: JSON.stringify({ pizzaId, quantity }) })
  },
  updateCartItem(pizzaId, quantity) {
    return request(`/cart/items/${pizzaId}`, { method: 'PATCH', body: JSON.stringify({ quantity }) })
  },
  removeCartItem(pizzaId) {
    return request(`/cart/items/${pizzaId}`, { method: 'DELETE' })
  },
  clearCart() {
    return request('/cart', { method: 'DELETE' })
  },
  placeOrder(deliveryAddress, paymentMethod, demoPaymentToken) {
    return request('/orders', { method: 'POST', body: JSON.stringify({ deliveryAddress, paymentMethod, demoPaymentToken }) })
  },
  retryDemoPayment(orderId, demoPaymentToken) {
    return request(`/orders/${orderId}/demo-payment`, { method: 'POST', body: JSON.stringify({ demoPaymentToken }) })
  },
}

export { normalizePizza }