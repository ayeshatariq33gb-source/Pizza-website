import { useEffect, useState } from 'react'
import useCart from '../hooks/useCart'
import { api } from '../lib/api'

function isValidCardExpiry(expiry) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) return false
  const [month, year] = expiry.split('/').map(Number)
  return month >= 1 && month <= 12 && new Date(2000 + year, month) > new Date()
}

export default function Account({ navigate, notify }) {
  const { user, logout } = useCart()
  const [profile, setProfile] = useState({ name: '', email: '' })
  const [orders, setOrders] = useState([])
  const [activeOrders, setActiveOrders] = useState([])
  const [message, setMessage] = useState('')
  const [retryOrderId, setRetryOrderId] = useState('')
  const [retryCardNumber, setRetryCardNumber] = useState('')
  const [retryCardholder, setRetryCardholder] = useState('')
  const [retryExpiry, setRetryExpiry] = useState('')
  const [retryCvv, setRetryCvv] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    Promise.all([api.request('/users/me'), api.request('/orders/mine'), api.request('/orders/active')])
      .then(([profileResult, orderResult, activeResult]) => {
        setProfile({ name: profileResult.user.name, email: profileResult.user.email })
        setOrders(orderResult.orders)
        setActiveOrders(activeResult.orders)
      })
      .catch((error) => setMessage(error.message))
  }, [user, navigate])

  async function saveProfile(event) {
    event.preventDefault()
    setMessage('')
    try {
      const result = await api.request('/users/me', { method: 'PATCH', body: JSON.stringify(profile) })
      setProfile({ name: result.user.name, email: result.user.email })
      localStorage.setItem('pizza-user', JSON.stringify(result.user))
      notify('Your profile has been updated.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  async function retryPayment(event, orderId) {
    event.preventDefault()
    setMessage('')
    try {
      const digits = retryCardNumber.replace(/\D/g, '')
      if (!isValidCardExpiry(retryExpiry)) throw new Error('Enter a valid, unexpired card expiry.')
      if (!retryCardholder.trim() || !/^\d{3,4}$/.test(retryCvv)) throw new Error('Enter a cardholder name and valid CVV.')
      const token = digits.endsWith('4242') ? 'demo-approved' : digits.endsWith('0002') ? 'demo-declined' : null
      if (!token) throw new Error('For this demo, use a card ending in 4242 to approve or 0002 to decline.')
      const { order } = await api.retryDemoPayment(orderId, token)
      setOrders((current) => current.map((item) => item._id === order._id ? order : item))
      setActiveOrders((current) => current.map((item) => item._id === order._id ? order : item))
      setRetryOrderId('')
      setRetryCardholder('')
      setRetryCardNumber('')
      setRetryExpiry('')
      setRetryCvv('')
      notify(order.paymentStatus === 'paid' ? `Demo payment complete. Order ${order._id.slice(-6)} is paid.` : 'Demo payment was declined.')
    } catch (error) {
      setMessage(error.message)
    }
  }

  function signOut() {
    logout()
    navigate('/')
  }

  return (
    <section className="account-page section-pad">
      <div className="content-width">
        <span className="eyebrow">YOUR TABLE, YOUR WAY</span>
        <h1>My account</h1>
        <div className="account-modal">
          <h2>Profile</h2>
          <form onSubmit={saveProfile}>
            <label>Name<input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} minLength="2" required /></label>
            <label>Email address<input type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required /></label>
            {message && <p role="alert">{message}</p>}
            <button className="button button--dark" type="submit">Save profile</button>
          </form>
          <button className="account-switch" type="button" onClick={signOut}>Sign out</button>
        </div>
        <section className="account-orders" aria-labelledby="current-orders-heading">
          <h2 id="current-orders-heading">Current orders</h2>
          {!activeOrders.length ? <p>You have no orders in progress.</p> : activeOrders.map((order) => (
            <article className="cart-item" key={order._id}>
              <div className="cart-item-info">
                <strong>Order {order._id.slice(-6)} · {order.status.replaceAll('-', ' ')}</strong>
                <span>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</span>
              </div>
              <strong>${order.total.toFixed(2)}</strong>
              <span>{order.paymentMethod === 'demo-card' ? 'Demo card' : 'Cash on delivery'} · Payment {order.paymentStatus} · ${order.paymentAmount.toFixed(2)} paid</span>
              {order.paymentMethod === 'demo-card' && order.paymentStatus === 'failed' && (retryOrderId === order._id ? <form className="retry-payment-form" onSubmit={(event) => retryPayment(event, order._id)}><label>Cardholder<input autoComplete="cc-name" value={retryCardholder} onChange={(event) => setRetryCardholder(event.target.value)} required /></label><label>Card number<input autoComplete="cc-number" inputMode="numeric" value={retryCardNumber} onChange={(event) => setRetryCardNumber(event.target.value.replace(/[^\d ]/g, '').slice(0, 23))} required /></label><div><label>Expiry<input autoComplete="cc-exp" value={retryExpiry} onChange={(event) => setRetryExpiry(event.target.value.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="MM/YY" required /></label><label>CVV<input autoComplete="cc-csc" type="password" value={retryCvv} onChange={(event) => setRetryCvv(event.target.value.replace(/\D/g, '').slice(0, 4))} required /></label></div><small>Demo only. Details stay in this browser. Card ending 4242 approves; 0002 declines.</small><button type="submit">Retry payment</button></form> : <button type="button" onClick={() => setRetryOrderId(order._id)}>Retry demo payment</button>)}
            </article>
          ))}
          <p>Purchased pizzas: {[...new Set(orders.filter((order) => order.status !== 'cancelled').flatMap((order) => order.items.map((item) => item.name)))].join(', ') || 'No purchases yet.'}</p>
          <h2 id="order-history-heading">Order history</h2>
          {!orders.length ? <p>Your past orders will show up here.</p> : orders.map((order) => (
            <article className="cart-item" key={order._id}>
              <div className="cart-item-info">
                <strong>Order {order._id.slice(-6)}</strong>
                <span>{new Date(order.createdAt).toLocaleDateString()} · {order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</span>
              </div>
              <strong>${order.total.toFixed(2)}</strong>
                <span>{order.status.replaceAll('-', ' ')} · {order.paymentMethod === 'demo-card' ? 'Demo card' : 'Cash on delivery'} · {order.paymentStatus} · ${order.paymentAmount.toFixed(2)} paid</span>
            </article>
          ))}
        </section>
      </div>
    </section>
  )
}