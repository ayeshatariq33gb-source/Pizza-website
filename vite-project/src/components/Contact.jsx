import { useState } from 'react'
import Icon from './Icon'
import { api } from '../lib/api'
import useSiteContent from '../hooks/useSiteContent'

export default function Contact() {
  const contact = useSiteContent()?.contact
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    setSent(false)
    setError('')
    const form = event.currentTarget
    const message = Object.fromEntries(new FormData(form).entries())
    try {
      await api.request('/contact', { method: 'POST', body: JSON.stringify(message) })
      form.reset()
      setSent(true)
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  const phoneLink = contact?.phone?.replace(/[^\d+]/g, '')

  return (
    <section className="contact-section section-pad" id="contact">
      <div className="contact-copy">
        <span className="eyebrow">{contact?.eyebrow || ''}</span>
        <h2>{contact?.title || ''}</h2>
        <p>{contact?.description || ''}</p>
        <div className="contact-detail"><span className="detail-icon"><Icon name="pin" size={19} /></span><div><strong>{contact?.addressLabel || ''}</strong><span>{contact?.address || ''}</span></div></div>
        <div className="contact-detail"><span className="detail-icon">◷</span><div><strong>{contact?.hoursLabel || ''}</strong><span>{contact?.hours || ''}</span></div></div>
        {contact?.phone && <a className="contact-phone" href={`tel:${phoneLink}`}>{contact.phone} <span>↗</span></a>}
      </div>
      <form className="contact-form" onSubmit={handleSubmit}>
        <div className="form-heading"><h3>Drop us a note</h3><span>{contact?.responseTime || ''}</span></div>
        <label>Your name<input name="name" placeholder="What should we call you?" maxLength="80" required /></label>
        <label>Email address<input name="email" type="email" placeholder="you@example.com" maxLength="254" required /></label>
        <label>What’s on your mind?<textarea name="message" rows="3" maxLength="3000" placeholder="Tell us everything..." required /></label>
        {error && <p role="alert">{error}</p>}
        <button className="button button--dark" type="submit">Send your note <Icon name="arrow" size={18} /></button>
        {sent && <p className="form-success" role="status">Thanks for reaching out. We’ll be in touch soon.</p>}
      </form>
    </section>
  )
}
