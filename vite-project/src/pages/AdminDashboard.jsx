import { startTransition, useEffect, useState } from 'react'
import useCart from '../hooks/useCart'
import { api } from '../lib/api'
import '../styles/admin.css'

const tabs = ['Overview', 'Pizzas', 'Categories', 'Orders', 'Users', 'Reviews', 'Messages', 'Site content']
const emptyPizza = { name: '', category: '', description: '', price: '', tag: '', image: '', available: true }

export default function AdminDashboard({ navigate }) {
  const { user, logout } = useCart()
  const [tab, setTab] = useState('Overview')
  const [dashboard, setDashboard] = useState(null)
  const [pizzas, setPizzas] = useState([])
  const [categories, setCategories] = useState([])
  const [orders, setOrders] = useState([])
  const [users, setUsers] = useState([])
  const [reviews, setReviews] = useState([])
  const [messages, setMessages] = useState([])
  const [content, setContent] = useState(null)
  const [pizzaForm, setPizzaForm] = useState(emptyPizza)
  const [editingPizza, setEditingPizza] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function refresh() {
    const [stats, pizzaResult, categoryResult, orderResult, userResult, reviewResult, messageResult, contentResult] = await Promise.all([
      api.request('/admin/dashboard'),
      api.request('/pizzas/admin/all'),
      api.request('/admin/categories'),
      api.request('/admin/orders'),
      api.request('/admin/users'),
      api.request('/admin/reviews'),
      api.request('/admin/contact-messages'),
      api.request('/admin/content'),
    ])
    startTransition(() => {
      setDashboard(stats)
      setPizzas(pizzaResult.pizzas)
      setCategories(categoryResult.categories)
      setOrders(orderResult.orders)
      setUsers(userResult.users)
      setReviews(reviewResult.reviews)
      setMessages(messageResult.messages)
      setContent(contentResult.content)
    })
  }

  useEffect(() => {
    if (!user) {
      navigate('/admin/login')
      return
    }
    if (user.role !== 'admin') {
      navigate('/admin/login')
      return
    }
    refresh().catch((requestError) => setError(requestError.message))
  }, [user, navigate])

  async function perform(action) {
    setError('')
    setBusy(true)
    try {
      await action()
      await refresh()
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setBusy(false)
    }
  }

  function editPizza(pizza) {
    setEditingPizza(pizza.id || pizza._id)
    setPizzaForm({ ...pizza, price: String(pizza.price) })
    setTab('Pizzas')
  }

  async function savePizza(event) {
    event.preventDefault()
    const payload = { ...pizzaForm, price: Number(pizzaForm.price) }
    await perform(async () => {
      await api.request(editingPizza ? `/pizzas/${editingPizza}` : '/pizzas', {
        method: editingPizza ? 'PATCH' : 'POST',
        body: JSON.stringify(payload),
      })
      setPizzaForm(emptyPizza)
      setEditingPizza('')
    })
  }

  async function saveContent(event) {
    event.preventDefault()
    const next = {
      ...content,
      about: {
        ...content.about,
        paragraphs: Array.isArray(content.about.paragraphs) ? content.about.paragraphs : String(content.about.paragraphs).split('\n').filter(Boolean),
        values: Array.isArray(content.about.values) ? content.about.values : String(content.about.values).split('\n').filter(Boolean),
      },
    }
    await perform(() => api.request('/admin/content', { method: 'PUT', body: JSON.stringify(next) }))
  }

  function setContentField(section, field, value) {
    setContent((current) => ({ ...current, [section]: { ...current[section], [field]: value } }))
  }

  async function signOut() {
    logout()
    navigate('/admin/login')
  }

  const formatDate = (date) => new Date(date).toLocaleString()

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <a className="admin-brand" href="/admin" onClick={(event) => event.preventDefault()}>Crust & Co. <span>Admin</span></a>
        <div className="admin-identity"><span>{user?.name}</span><button type="button" onClick={signOut}>Sign out</button></div>
      </header>
      <nav className="admin-tabs" aria-label="Admin sections">
        {tabs.map((item) => <button key={item} type="button" className={tab === item ? 'active' : ''} onClick={() => setTab(item)}>{item}</button>)}
      </nav>
      <section className="admin-content">
        {error && <p className="admin-error" role="alert">{error}</p>}
        {tab === 'Overview' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">SHOP REPORT</span><h1>Overview</h1></div><button type="button" onClick={() => refresh().catch((item) => setError(item.message))}>Refresh</button></div>
          <div className="admin-stats">{[
            ['Customers', dashboard?.users ?? '—'], ['Menu items', dashboard?.pizzas ?? '—'], ['Orders', dashboard?.orders ?? '—'], ['Active orders', dashboard?.pendingOrders ?? '—'], ['Paid orders', dashboard?.paidOrders ?? '—'], ['Paid revenue', dashboard ? `$${dashboard.revenue.toFixed(2)}` : '—'],
          ].map(([label, value]) => <article key={label}><span>{label}</span><strong>{value}</strong></article>)}</div>
          <section className="admin-table-section"><h2>Top-selling pizzas</h2><div className="admin-table-wrap"><table><thead><tr><th>Pizza</th><th>Units</th><th>Sales</th></tr></thead><tbody>{dashboard?.topPizzas?.map((pizza) => <tr key={pizza._id}><td>{pizza._id}</td><td>{pizza.units}</td><td>${pizza.sales.toFixed(2)}</td></tr>)}</tbody></table></div></section>
        </>}
        {tab === 'Pizzas' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">MENU MANAGEMENT</span><h1>Pizzas</h1></div></div>
          <form className="admin-form admin-pizza-form" onSubmit={savePizza}>
            <h2>{editingPizza ? 'Edit pizza' : 'Add pizza'}</h2>
            <label>Name<input value={pizzaForm.name} onChange={(event) => setPizzaForm({ ...pizzaForm, name: event.target.value })} required maxLength="100" /></label>
            <label>Category<select value={pizzaForm.category} onChange={(event) => setPizzaForm({ ...pizzaForm, category: event.target.value })} required><option value="">Choose category</option>{categories.filter((category) => category.active).map((category) => <option key={category._id} value={category.name}>{category.name}</option>)}</select></label>
            <label>Description<textarea value={pizzaForm.description} onChange={(event) => setPizzaForm({ ...pizzaForm, description: event.target.value })} required maxLength="500" /></label>
            <label>Price<input type="number" min="0" step="0.01" value={pizzaForm.price} onChange={(event) => setPizzaForm({ ...pizzaForm, price: event.target.value })} required /></label>
            <label>Image ID<input value={pizzaForm.image} onChange={(event) => setPizzaForm({ ...pizzaForm, image: event.target.value })} placeholder="Unsplash photo ID" /></label>
            <label>Tag<input value={pizzaForm.tag} onChange={(event) => setPizzaForm({ ...pizzaForm, tag: event.target.value })} maxLength="40" /></label>
            <label className="admin-check"><input type="checkbox" checked={pizzaForm.available} onChange={(event) => setPizzaForm({ ...pizzaForm, available: event.target.checked })} /> Available</label>
            <div className="admin-form-actions"><button className="button button--dark" disabled={busy}>{editingPizza ? 'Save changes' : 'Add pizza'}</button>{editingPizza && <button type="button" onClick={() => { setPizzaForm(emptyPizza); setEditingPizza('') }}>Cancel</button>}</div>
          </form>
          <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Availability</th><th>Actions</th></tr></thead><tbody>{pizzas.map((pizza) => <tr key={pizza._id}><td>{pizza.name}</td><td>{pizza.category}</td><td>${pizza.price.toFixed(2)}</td><td>{pizza.available ? 'Available' : 'Hidden'}</td><td><button type="button" onClick={() => editPizza(pizza)}>Edit</button><button type="button" onClick={() => perform(() => api.request(`/pizzas/${pizza._id}`, { method: 'DELETE' }))}>Delete</button></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Categories' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">MENU ORGANIZATION</span><h1>Categories</h1></div></div>
          <form className="admin-inline-form" onSubmit={(event) => { event.preventDefault(); perform(async () => { await api.request('/admin/categories', { method: 'POST', body: JSON.stringify({ name: categoryName }) }); setCategoryName('') }) }}><label>New category<input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} required maxLength="50" /></label><button className="button button--dark" disabled={busy}>Add category</button></form>
          <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Status</th><th>Actions</th></tr></thead><tbody>{categories.map((category) => <tr key={category._id}><td>{category.name}</td><td>{category.active ? 'Active' : 'Hidden'}</td><td><button type="button" onClick={() => { const name = window.prompt('Category name', category.name); if (name) perform(() => api.request(`/admin/categories/${category._id}`, { method: 'PATCH', body: JSON.stringify({ name }) })) }}>Rename</button><button type="button" onClick={() => perform(() => api.request(`/admin/categories/${category._id}`, { method: 'PATCH', body: JSON.stringify({ active: !category.active }) }))}>{category.active ? 'Hide' : 'Show'}</button><button type="button" onClick={() => perform(() => api.request(`/admin/categories/${category._id}`, { method: 'DELETE' }))}>Delete</button></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Orders' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">FULFILLMENT</span><h1>Orders</h1></div></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer / address</th><th>Items</th><th>Amount</th><th>Payment method</th><th>Payment status</th><th>Delivery status</th></tr></thead><tbody>{orders.map((order) => <tr key={order._id}><td>{order._id.slice(-6)}<small>{formatDate(order.createdAt)}</small></td><td>{order.user?.name}<small>{order.user?.email}</small><small>{order.deliveryAddress}</small></td><td>{order.items.map((item) => `${item.quantity} × ${item.name}`).join(', ')}</td><td>${order.total.toFixed(2)}<small>${order.paymentAmount.toFixed(2)} received</small></td><td>{order.paymentMethod === 'demo-card' ? 'Demo card' : 'Cash on delivery'}</td><td><select value={order.paymentStatus} onChange={(event) => perform(() => api.request(`/admin/orders/${order._id}/payment`, { method: 'PATCH', body: JSON.stringify({ paymentStatus: event.target.value }) }))}><option value="pending">Pending</option><option value="paid">Paid</option><option value="failed">Failed</option></select></td><td><select value={order.status} onChange={(event) => perform(() => api.request(`/admin/orders/${order._id}/status`, { method: 'PATCH', body: JSON.stringify({ status: event.target.value }) }))}>{['pending', 'confirmed', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'].map((status) => <option key={status} value={status}>{status.replaceAll('-', ' ')}</option>)}</select></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Users' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">CUSTOMER ACCOUNTS</span><h1>Users</h1></div></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead><tbody>{users.map((account) => <tr key={account._id}><td>{account.name}</td><td>{account.email}</td><td><select value={account.role} onChange={(event) => perform(() => api.request(`/admin/users/${account._id}`, { method: 'PATCH', body: JSON.stringify({ role: event.target.value }) }))}><option value="customer">Customer</option><option value="admin">Admin</option></select></td><td>{new Date(account.createdAt).toLocaleDateString()}</td><td><button type="button" onClick={() => perform(() => api.request(`/admin/users/${account._id}`, { method: 'DELETE' }))} disabled={account._id === user?.id}>Delete</button></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Reviews' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">CUSTOMER FEEDBACK</span><h1>Reviews</h1></div></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Customer</th><th>Pizza</th><th>Rating</th><th>Review</th><th>Actions</th></tr></thead><tbody>{reviews.map((review) => <tr key={review._id}><td>{review.user?.name}</td><td>{review.pizza?.name}</td><td>{review.rating} / 5</td><td>{review.comment}</td><td><button type="button" onClick={() => perform(() => api.request(`/admin/reviews/${review._id}`, { method: 'DELETE' }))}>Remove</button></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Messages' && <>
          <div className="admin-page-heading"><div><span className="eyebrow">CUSTOMER CONTACT</span><h1>Messages</h1></div></div>
          <div className="admin-table-wrap"><table><thead><tr><th>Received</th><th>Customer</th><th>Email</th><th>Message</th><th>Status</th><th>Actions</th></tr></thead><tbody>{messages.map((item) => <tr key={item._id}><td>{formatDate(item.createdAt)}</td><td>{item.name}</td><td>{item.email}</td><td>{item.message}</td><td>{item.status}</td><td><select value={item.status} onChange={(event) => perform(() => api.request(`/admin/contact-messages/${item._id}`, { method: 'PATCH', body: JSON.stringify({ status: event.target.value }) }))}><option value="new">New</option><option value="read">Read</option><option value="resolved">Resolved</option></select><button type="button" onClick={() => perform(() => api.request(`/admin/contact-messages/${item._id}`, { method: 'DELETE' }))}>Delete</button></td></tr>)}</tbody></table></div>
        </>}
        {tab === 'Site content' && content && <>
          <div className="admin-page-heading"><div><span className="eyebrow">CONTENT MANAGEMENT</span><h1>Site content</h1></div></div>
          <form className="admin-content-form" onSubmit={saveContent}>
            {['hero', 'about', 'offer', 'contact'].map((section) => <fieldset key={section}><legend>{section === 'hero' ? 'Hero' : section === 'about' ? 'About story and values' : section === 'offer' ? 'Offer' : 'Contact'}</legend>{Object.entries(content[section]).filter(([key]) => !['_id'].includes(key)).map(([key, value]) => <label key={key}>{key.replace(/[A-Z]/g, (letter) => ` ${letter.toLowerCase()}`)}{key === 'paragraphs' || key === 'values' ? <textarea value={Array.isArray(value) ? value.join('\n') : value} onChange={(event) => setContentField(section, key, event.target.value.split('\n'))} /> : <input type={typeof value === 'number' ? 'number' : 'text'} value={value} onChange={(event) => setContentField(section, key, typeof value === 'number' ? Number(event.target.value) : event.target.value)} />}</label>)}</fieldset>)}
            <button className="button button--dark" disabled={busy}>Save site content</button>
          </form>
        </>}
      </section>
    </main>
  )
}
