import { useEffect, useState } from 'react'
import CartContext from './cartContext'
import { api } from '../lib/api'

function readStoredCart() {
  try {
    return JSON.parse(localStorage.getItem('pizza-guest-cart') || '[]')
  } catch {
    return []
  }
}

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('pizza-user') || 'null')
  } catch {
    return null
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(readStoredCart)
  const [token, setToken] = useState(() => localStorage.getItem('pizza-token'))
  const [user, setUser] = useState(readStoredUser)

  useEffect(() => {
    localStorage.setItem('pizza-guest-cart', JSON.stringify(items))
  }, [items])

  useEffect(() => {
    if (!token) return undefined
    let active = true
    Promise.all([api.request('/users/me'), api.cart()])
      .then(([profile, cart]) => {
        if (!active) return
        setUser(profile.user)
        localStorage.setItem('pizza-user', JSON.stringify(profile.user))
        setItems(cart)
      })
      .catch(() => {
        if (!active) return
        localStorage.removeItem('pizza-token')
        localStorage.removeItem('pizza-user')
        setToken(null)
        setUser(null)
      })
    return () => { active = false }
  }, [token])

  async function addItem(pizza) {
    if (token) {
      await api.addCartItem(pizza.id)
      setItems(await api.cart())
      return
    }
    setItems((current) => {
      const existing = current.find((item) => item.id === pizza.id)
      return existing
        ? current.map((item) => item.id === pizza.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current, { ...pizza, quantity: 1 }]
    })
  }

  async function updateQuantity(id, amount) {
    if (token) {
      const current = items.find((item) => item.id === id)
      if (!current) return
      if (current.quantity + amount <= 0) await api.removeCartItem(id)
      else await api.updateCartItem(id, current.quantity + amount)
      setItems(await api.cart())
      return
    }
    setItems((current) => current
      .map((item) => item.id === id ? { ...item, quantity: item.quantity + amount } : item)
      .filter((item) => item.quantity > 0))
  }

  async function authenticate(action, details) {
    const result = await api[action](details)
    localStorage.setItem('pizza-token', result.token)
    localStorage.setItem('pizza-user', JSON.stringify(result.user))
    setUser(result.user)
    for (const item of items) await api.addCartItem(item.id, item.quantity)
    setToken(result.token)
    setItems(await api.cart())
    return result.user
  }

  function logout() {
    localStorage.removeItem('pizza-token')
    localStorage.removeItem('pizza-user')
    setToken(null)
    setUser(null)
  }

  async function placeOrder(deliveryAddress, paymentMethod, demoPaymentToken) {
    const result = await api.placeOrder(deliveryAddress, paymentMethod, demoPaymentToken)
    setItems([])
    return result.order
  }

  async function clearCart() {
    if (token) await api.clearCart()
    setItems([])
  }

  const value = {
    items,
    addItem,
    updateQuantity,
    clearCart,
    login: (details) => authenticate('login', details),
    register: (details) => authenticate('register', details),
    logout,
    placeOrder,
    user,
    count: items.reduce((total, item) => total + item.quantity, 0),
    total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
