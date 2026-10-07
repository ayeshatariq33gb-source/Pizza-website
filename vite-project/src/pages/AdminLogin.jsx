import { useState } from 'react'
import Icon from '../components/Icon'
import useCart from '../hooks/useCart'
import '../styles/admin.css'

export default function AdminLogin({ navigate }) {
  const { login, logout } = useCart()
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const credentials = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      const user = await login(credentials)
      if (user.role !== 'admin') {
        logout()
        throw new Error('This account does not have administrator access.')
      }
      navigate('/admin')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="admin-login-page">
      <a className="admin-back-link" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}>← Back to Crust & Co.</a>
      <section className="admin-login-panel">
        <span className="eyebrow">CRUST & CO. OPERATIONS</span>
        <h1>Administrator sign in</h1>
        <p>Use an administrator account to manage the shop.</p>
        <form onSubmit={submit}>
          <label>Email<input name="email" type="email" autoComplete="username" required /></label>
          <label>Password<input name="password" type="password" autoComplete="current-password" required /></label>
          {error && <p role="alert" className="admin-error">{error}</p>}
          <button className="button button--dark" type="submit" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'} <Icon name="arrow" size={18} /></button>
        </form>
      </section>
    </main>
  )
}
