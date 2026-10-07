import { useState } from 'react'
import useCart from '../hooks/useCart'
import Icon from './Icon'

const links = [
  { label: 'Home', path: '/' },
  { label: 'Our menu', path: '/menu' },
  { label: 'Our story', path: '/about' },
  { label: 'Find us', path: '/contact' },
]

export default function Navbar({ route, navigate }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { count, user } = useCart()

  return (
    <>
      <div className="topline"><span>Good food, right on time.</span><span>Free delivery on orders over $35 <i>·</i> <a href="/menu" onClick={(event) => { event.preventDefault(); navigate('/menu') }}>Order now</a></span></div>
      <header className="site-header">
        <a className="wordmark" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }} aria-label="Crust and Co. home"><span className="brand-mark">C<span>.</span></span><span className="brand-name">crust<span>&</span>co.</span></a>
        <button className="mobile-menu-button icon-button" type="button" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name={menuOpen ? 'close' : 'menu'} /></button>
        <nav className={`main-nav ${menuOpen ? 'main-nav--open' : ''}`} aria-label="Main navigation">
          {links.map((link) => <a key={link.path} className={route === link.path ? 'is-current' : ''} href={link.path} onClick={(event) => { event.preventDefault(); navigate(link.path); setMenuOpen(false) }}>{link.label}</a>)}
        </nav>
        <div className="header-actions"><button type="button" className="account-button" onClick={() => navigate(user ? '/account' : '/login')} title={user ? 'My account' : 'Sign in'}><Icon name="user" size={19} /><span>{user ? 'My account' : 'Sign in'}</span></button><button type="button" className="cart-button" onClick={() => navigate('/cart')}><Icon name="bag" size={18} /><span>My order</span><span className="cart-count">{count}</span></button></div>
      </header>
    </>
  )
}
