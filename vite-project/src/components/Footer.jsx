import { useState } from 'react'
import Icon from './Icon'

export default function Footer({ navigate }) {
  const [subscribed, setSubscribed] = useState(false)
  function subscribe(event) {
    event.preventDefault()
    event.currentTarget.reset()
    setSubscribed(true)
  }

  return <footer className="site-footer"><div className="footer-main"><div className="footer-brand"><a className="wordmark wordmark--light" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}><span className="brand-mark">C<span>.</span></span><span className="brand-name">crust<span>&</span>co.</span></a><p>Good pizza, good people,<br />good things around the corner.</p><div className="social-links"><a href="https://instagram.com" aria-label="Instagram">ig</a><a href="https://tiktok.com" aria-label="TikTok">tk</a><a href="https://facebook.com" aria-label="Facebook">f</a></div></div><div className="footer-column"><strong>Come hungry</strong><a href="/menu" onClick={(event) => { event.preventDefault(); navigate('/menu') }}>Our menu</a><a href="/menu" onClick={(event) => { event.preventDefault(); navigate('/menu') }}>Pizza bundles</a><a href="/contact" onClick={(event) => { event.preventDefault(); navigate('/contact') }}>Catering</a></div><div className="footer-column"><strong>Get to know us</strong><a href="/about" onClick={(event) => { event.preventDefault(); navigate('/about') }}>Our story</a><a href="/about" onClick={(event) => { event.preventDefault(); navigate('/about') }}>The good word</a><a href="/contact" onClick={(event) => { event.preventDefault(); navigate('/contact') }}>Contact us</a><a href="/login" onClick={(event) => { event.preventDefault(); navigate('/login') }}>Your account</a></div><div className="footer-newsletter"><strong>A little note from us.</strong><p>New pies, neighborhood news, and the occasional excellent pun.</p><form onSubmit={subscribe}><label className="sr-only" htmlFor="newsletter-email">Email address</label><input id="newsletter-email" type="email" placeholder="Your email address" required /><button type="submit" aria-label="Subscribe"><Icon name="arrow" size={19} /></button></form>{subscribed && <small role="status">You’re on the list. Talk soon!</small>}</div></div><div className="footer-bottom"><span>© 2025 Crust & Co. Made with a little extra love.</span><span><a href="#privacy">Privacy</a><a href="#terms">Terms</a><span>Brooklyn, NY · EST. 2014</span></span></div></footer>
}
