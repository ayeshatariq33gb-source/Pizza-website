import { useEffect, useState } from 'react'
import { imageUrl } from '../data/pizzas'
import Icon from './Icon'
import useSiteContent from '../hooks/useSiteContent'
import { api } from '../lib/api'

export default function Hero({ navigate }) {
  const content = useSiteContent()?.hero
  const [reviewSummary, setReviewSummary] = useState({ average: 0, count: 0 })

  useEffect(() => {
    api.request('/reviews').then(({ reviews }) => {
      const average = reviews.length ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0
      setReviewSummary({ average, count: reviews.length })
    }).catch(() => {})
  }, [])

  return (
    <section className="hero" id="home">
      <div className="hero-copy"><span className="eyebrow"><span className="eyebrow-dot" /> {content?.eyebrow || ' '}</span><h1>{content?.title || ''}</h1><p>{content?.description || ''}</p><div className="hero-actions"><button className="button button--dark" type="button" onClick={() => navigate('/menu')}>Find your slice <Icon name="arrow" size={18} /></button><a className="text-link" href="/about" onClick={(event) => { event.preventDefault(); navigate('/about') }}>A little about us <span>↗</span></a></div><div className="hero-proof"><div className="proof-avatars"><img src={imageUrl('photo-1534528741775-53994a69daeb', 80)} alt="" /><img src={imageUrl('photo-1500648767791-00dcc994a43e', 80)} alt="" /><img src={imageUrl('photo-1531123897727-8f129e1688ce', 80)} alt="" /></div><div><div className="proof-stars">★★★★★ <span>{reviewSummary.count ? `${reviewSummary.average.toFixed(1)}/5` : ''}</span></div><small>{content?.proof || ''}</small></div></div></div>
      <div className="hero-visual"><img src={imageUrl(content?.image || 'photo-1513104890138-7c749659a591', 1400)} alt={content?.imageAlt || 'Freshly baked pizza'} /><div className="hero-stamp"><span>made with</span><strong>good<br />things</strong><span>since 2014</span></div><div className="hero-note"><span className="note-line" />Hot from<br />our oven</div></div>
      <a className="hero-scroll" href="#menu"><span className="scroll-line" /> SCROLL FOR THE GOOD STUFF</a>
    </section>
  )
}
