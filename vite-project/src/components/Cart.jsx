import { useState } from 'react'
import Icon from './Icon'
import useCart from '../hooks/useCart'
import { imageUrl } from '../data/pizzas'

export default function Cart({ navigate, notify }) {
  const { items, updateQuantity, count, total, user, placeOrder } = useCart()
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash-on-delivery')
  const [cardholder, setCardholder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submitOrder(event) {
    event.preventDefault()
    if (!user) {
      sessionStorage.setItem('pizza-return-to', '/cart')
      notify('Sign in or create an account to place your order.')
      navigate('/login')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      let paymentToken
      if (paymentMethod === 'demo-card') {
        const digits = cardNumber.replace(/\D/g, '')
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) throw new Error('Enter expiry in MM/YY format.')
        const [month, year] = expiry.split('/').map(Number)
        const expiryDate = new Date(2000 + year, month)
        if (month < 1 || month > 12 || expiryDate <= new Date()) throw new Error('Enter a valid, unexpired card expiry.')
        if (!cardholder.trim() || !/^\d{3,4}$/.test(cvv)) throw new Error('Enter a cardholder name and a 3- or 4-digit CVV.')
        if (digits.endsWith('4242')) paymentToken = 'demo-approved'
        else if (digits.endsWith('0002')) paymentToken = 'demo-declined'
        else throw new Error('For this demo, use a card ending in 4242 to approve or 0002 to decline.')
        await new Promise((resolve) => window.setTimeout(resolve, 650))
      }
      const order = await placeOrder(deliveryAddress, paymentMethod, paymentToken)
      if (order.paymentStatus === 'paid') {
        notify(`Payment complete. Order ${order._id.slice(-6)} is paid.`)
        navigate('/account')
      } else if (order.paymentStatus === 'failed') {
        notify(`Demo payment declined for order ${order._id.slice(-6)}. You can retry it from your account.`)
        navigate('/account')
      } else {
        notify(`Order ${order._id.slice(-6)} placed. Payment is pending on delivery.`)
        navigate('/account')
      }
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function changeQuantity(id, amount) {
    try {
      await updateQuantity(id, amount)
    } catch (requestError) {
      notify(requestError.message)
    }
  }

  return (
    <section className="cart-page section-pad">
      <div className="content-width">
        <span className="eyebrow">MADE FRESH, JUST FOR YOU</span>
        <h1>Your order<span className="cart-page-count"> ({count})</span></h1>
        {items.length === 0 ? (
          <div className="empty-cart">
            <span className="empty-cart-icon"><Icon name="bag" size={34} /></span>
            <h3>Your table’s waiting.</h3>
            <p>There’s nothing in your order yet. Let’s fix that.</p>
            <button type="button" className="button button--dark" onClick={() => navigate('/menu')}>
              Explore the menu <Icon name="arrow" size={18} />
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              {items.map((item) => (
                <article className="cart-item" key={item.id}>
                  <img src={imageUrl(item.image, 200)} alt={`${item.name} pizza`} />
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>${item.price} each</span>
                    <div className="quantity-control">
                      <button type="button" aria-label={`Remove one ${item.name}`} onClick={() => changeQuantity(item.id, -1)}><Icon name="minus" size={14} /></button>
                      <span>{item.quantity}</span>
                      <button type="button" aria-label={`Add one ${item.name}`} onClick={() => changeQuantity(item.id, 1)}><Icon name="plus" size={14} /></button>
                    </div>
                  </div>
                  <strong className="cart-line-price">${(item.price * item.quantity).toFixed(2)}</strong>
                </article>
              ))}
            </div>
            <aside className="cart-summary">
              <h2>Order summary</h2>
              <p><span>Subtotal</span><strong>${total.toFixed(2)}</strong></p>
              <p><span>Delivery</span><span>{total >= 35 ? 'On us' : '$3.50'}</span></p>
              <p className="summary-total"><span>Total due</span><strong>${(total + (total >= 35 ? 0 : 3.5)).toFixed(2)}</strong></p>
              <small>Taxes calculated at checkout.</small>
              <form onSubmit={submitOrder}>
                <label htmlFor="delivery-address">Delivery address</label>
                <textarea id="delivery-address" value={deliveryAddress} onChange={(event) => setDeliveryAddress(event.target.value)} placeholder="Street, city, postal code" minLength="8" maxLength="500" required />
                <small>{user ? 'Your order will be sent to this address.' : 'Sign in is required to place an order.'}</small>
                <fieldset className="payment-options">
                  <legend>Payment method</legend>
                  <label><input type="radio" name="payment-method" value="demo-card" checked={paymentMethod === 'demo-card'} onChange={() => setPaymentMethod('demo-card')} /> Card payment <small>Demo only</small></label>
                  <label><input type="radio" name="payment-method" value="cash-on-delivery" checked={paymentMethod === 'cash-on-delivery'} onChange={() => setPaymentMethod('cash-on-delivery')} /> Cash on delivery <small>Payment pending</small></label>
                </fieldset>
                {paymentMethod === 'demo-card' && <fieldset className="demo-card-fields">
                  <legend>Secure demo checkout</legend>
                  <p>Test only. Card details stay in this browser and are never sent or stored.</p>
                  <label>Cardholder name<input autoComplete="cc-name" value={cardholder} onChange={(event) => setCardholder(event.target.value)} required /></label>
                  <label>Card number<input autoComplete="cc-number" inputMode="numeric" value={cardNumber} onChange={(event) => setCardNumber(event.target.value.replace(/[^\d ]/g, '').slice(0, 23))} placeholder="4242 4242 4242 4242" required /></label>
                  <div className="demo-card-row"><label>Expiry<input autoComplete="cc-exp" inputMode="numeric" value={expiry} onChange={(event) => setExpiry(event.target.value.replace(/[^\d/]/g, '').slice(0, 5))} placeholder="MM/YY" pattern="(0[1-9]|1[0-2])/[0-9]{2}" required /></label><label>CVV<input autoComplete="cc-csc" inputMode="numeric" type="password" value={cvv} onChange={(event) => setCvv(event.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" required /></label></div>
                  <small>Success: card ending in 4242. Decline: card ending in 0002.</small>
                </fieldset>}
                {error && <p role="alert">{error}</p>}
                <button type="submit" className="button button--dark checkout-button" disabled={submitting}>
                  {user ? submitting ? paymentMethod === 'demo-card' ? 'Processing demo payment...' : 'Placing order...' : `Place order · ${paymentMethod === 'demo-card' ? 'Pay now' : 'Pay on delivery'}` : 'Sign in to place order'} <Icon name="arrow" size={18} />
                </button>
              </form>
              <span className="secure-note">Made fresh when you order · Delivered with care</span>
            </aside>
          </div>
        )}
      </div>
    </section>
  )
}
