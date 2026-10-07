import { useState } from 'react'
import Icon from './Icon'
import useCart from '../hooks/useCart'

export default function AccountForm({ notify, navigate }) {
  const [mode, setMode] = useState('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, register } = useCart()

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    const details = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      if (mode === 'login') await login(details)
      else await register(details)
      notify(mode === 'login' ? 'Welcome back to Crust & Co.' : 'Your account is ready. Welcome in!')
      const destination = sessionStorage.getItem('pizza-return-to') || '/'
      sessionStorage.removeItem('pizza-return-to')
      navigate(destination)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return <section className="account-page section-pad"><div className="account-modal"><span className="eyebrow">A SEAT AT THE TABLE</span><h1>{mode === 'login' ? 'Welcome back.' : 'Let’s get acquainted.'}</h1><p>{mode === 'login' ? 'Sign in for the good stuff, saved for you.' : 'A better pizza night starts right here.'}</p><form onSubmit={handleSubmit}>{mode === 'register' && <label>Your name<input name="name" placeholder="First and last name" autoComplete="name" required /></label>}<label>Email address<input type="email" name="email" placeholder="you@example.com" autoComplete="email" required /></label><label>Password<input type="password" name="password" placeholder="At least 8 characters" minLength="8" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /></label>{error && <p role="alert">{error}</p>}<button type="submit" className="button button--dark" disabled={submitting}>{submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'} <Icon name="arrow" size={18} /></button></form><p className="account-switch">{mode === 'login' ? 'New around here?' : 'Already part of the family?'} <button type="button" onClick={() => { setError(''); setMode(mode === 'login' ? 'register' : 'login') }}>{mode === 'login' ? 'Create an account' : 'Sign in'}</button></p><p className="account-switch"><button type="button" onClick={() => navigate('/admin/login')}>Administrator sign in</button></p></div></section>
}
