import { useEffect, useState } from 'react'
import { imageUrl } from '../data/pizzas'
import { api } from '../lib/api'
import useSiteContent from '../hooks/useSiteContent'
import Icon from './Icon'

export default function Offers({ onAdd }) {
  const offer = useSiteContent()?.offer
  const [bundle, setBundle] = useState(null)

  useEffect(() => {
    api.pizzas({ category: 'Deals' }).then(({ pizzas }) => setBundle(pizzas[0] || null)).catch(() => {})
  }, [])

  return (
    <section className="offer-section">
      <div className="offer-image">
        <img src={imageUrl(offer?.image || 'photo-1571407970349-bc81e7e96d47', 1100)} alt={offer?.imageAlt || 'A table set for pizza night'} loading="lazy" />
        <span className="offer-image-label">{offer?.label || ''}</span>
      </div>
      <div className="offer-copy">
        <span className="eyebrow eyebrow--light">{offer?.eyebrow || ''}</span>
        <h2>{offer?.title || ''}</h2>
        <p>{offer?.description || ''}</p>
        <div className="offer-price"><strong>${bundle?.price ?? 0}</strong><span>{offer?.serves || ''} <s>{offer?.originalPrice ? `$${offer.originalPrice}` : ''}</s></span></div>
        <button className="button button--cream" type="button" onClick={() => bundle && onAdd(bundle)} disabled={!bundle}>Get the bundle <Icon name="arrow" size={18} /></button>
        <span className="offer-footnote">{offer?.footnote || ''}</span>
      </div>
    </section>
  )
}
