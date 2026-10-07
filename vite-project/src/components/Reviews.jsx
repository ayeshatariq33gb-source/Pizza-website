import { startTransition, useEffect, useState } from 'react'
import { imageUrl } from '../data/pizzas'
import { api } from '../lib/api'
import useCart from '../hooks/useCart'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [pizzas, setPizzas] = useState([])
  const [activeReview, setActiveReview] = useState(0)
  const [pizzaId, setPizzaId] = useState('')
  const [rating, setRating] = useState('5')
  const [comment, setComment] = useState('')
  const [message, setMessage] = useState('')
  const { user } = useCart()

  async function loadReviews() {
    const result = await api.request('/reviews')
    startTransition(() => setReviews(result.reviews))
  }

  useEffect(() => {
    loadReviews().catch(() => startTransition(() => setMessage('Customer reviews are unavailable right now.')))
    api.pizzas().then(({ pizzas: menu }) => {
      startTransition(() => setPizzas(menu))
    }).catch(() => {})
  }, [])

  async function submitReview(event) {
    event.preventDefault()
    setMessage('')
    try {
      await api.request('/reviews', { method: 'POST', body: JSON.stringify({ pizzaId: pizzaId || pizzas[0]?.id, rating: Number(rating), comment }) })
      setComment('')
      setMessage('Thanks for sharing your review.')
      await loadReviews()
    } catch (error) {
      setMessage(error.message)
    }
  }

  const review = reviews[activeReview]
  return <section className="review-section section-pad" id="reviews"><div className="review-photo"><img src={imageUrl('photo-1529042410759-befb1204b468', 1000)} alt="Friends sharing a meal around the table" loading="lazy" /><span>GOOD FOOD<br />BRINGS US<br />TOGETHER.</span></div><div className="review-content"><span className="eyebrow">DON’T JUST TAKE OUR WORD FOR IT</span>{review ? <><div className="review-stars" aria-label={`${review.rating} out of 5 stars`}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div><blockquote>“{review.comment || `Rated ${review.pizza?.name || 'this pizza'} ${review.rating} out of 5.`}”</blockquote><div className="review-byline"><span className="review-avatar">{review.user?.name?.slice(0, 1).toUpperCase() || 'P'}</span><span><strong>{review.user?.name || 'Pizza guest'}</strong><small>{review.pizza?.name || 'Customer review'}</small></span><span className="review-count">{String(activeReview + 1).padStart(2, '0')} / {String(reviews.length).padStart(2, '0')}</span></div><div className="review-dots" aria-label="Choose a customer review">{reviews.slice(0, 5).map((item, index) => <button key={item._id} type="button" aria-label={`Show review ${index + 1}`} aria-pressed={activeReview === index} className={activeReview === index ? 'active' : ''} onClick={() => setActiveReview(index)} />)}</div></> : <blockquote>{message || 'Be the first to leave a review.'}</blockquote>}{user && pizzas.length > 0 && <form className="review-form" onSubmit={submitReview}><label>Pizza<select value={pizzaId || pizzas[0].id} onChange={(event) => setPizzaId(event.target.value)}>{pizzas.map((pizza) => <option key={pizza.id} value={pizza.id}>{pizza.name}</option>)}</select></label><label>Rating<select value={rating} onChange={(event) => setRating(event.target.value)}>{[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} stars</option>)}</select></label><label>Your review<textarea value={comment} onChange={(event) => setComment(event.target.value)} maxLength="1000" placeholder="What did you think?" /></label><button className="button button--dark" type="submit">Submit review</button></form>}{message && <p role="status">{message}</p>}</div></section>
}
