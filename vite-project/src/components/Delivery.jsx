import Icon from './Icon'

export default function Delivery({ navigate }) {
  return <section className="delivery-band"><div className="delivery-icon"><Icon name="pin" size={28} /></div><div><span className="eyebrow eyebrow--light">YOUR NEIGHBORHOOD, DELIVERED</span><h2>Hot pizza. Happy doorstep.</h2></div><p>Made fresh, packed with care, and on its way to you in about 30 minutes.</p><button type="button" className="button button--cream" onClick={() => navigate('/contact')}>Check your address <Icon name="arrow" size={18} /></button></section>
}
