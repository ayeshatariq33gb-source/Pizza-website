import { useEffect, useState } from 'react'
import { api, normalizePizza } from '../lib/api'
import { imageUrl } from '../data/pizzas'
import Icon from '../components/Icon'
import '../styles/details.css'

export default function PizzaDetails({ id, addItem, navigate }) {
  const [pizza, setPizza] = useState(null)
  const [reviews, setReviews] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    Promise.all([api.request(`/pizzas/${id}`), api.request(`/reviews?pizzaId=${id}`)])
      .then(([pizzaResult, reviewResult]) => {
        setPizza(normalizePizza(pizzaResult.pizza))
        setReviews(reviewResult.reviews)
      })
      .catch((requestError) => setError(requestError.message))
  }, [id])

  if (error) return <section className="pizza-detail-page"><p role="alert">{error}</p><button type="button" onClick={() => navigate('/menu')}>Back to the menu</button></section>
  if (!pizza) return <section className="pizza-detail-page"><p>Loading pizza...</p></section>

  return (
    <section className="pizza-detail-page">
      <button type="button" className="detail-back" onClick={() => navigate('/menu')}>← Back to menu</button>
      <div className="pizza-detail-main">
        <img className="pizza-detail-image" src={imageUrl(pizza.image, 1200)} alt={`${pizza.name} pizza`} />
        <div className="pizza-detail-copy">
          <span className="eyebrow">{pizza.category.toUpperCase()}</span>
          <h1>{pizza.name}</h1>
          <p>{pizza.description}</p>
          <div className="detail-rating"><span>★</span> {pizza.rating} <small>({reviews.length} reviews)</small></div>
          <strong className="detail-price">${Number(pizza.price).toFixed(2)}</strong>
          <button className="button button--dark" type="button" onClick={() => addItem(pizza)}>Add to order <Icon name="plus" size={17} /></button>
        </div>
      </div>
      <section className="pizza-detail-reviews">
        <h2>Customer reviews</h2>
        {!reviews.length ? <p>No reviews yet.</p> : reviews.map((review) => (
          <article key={review._id}>
            <div><strong>{review.user?.name || 'Pizza guest'}</strong><span>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span></div>
            <p>{review.comment || 'Rated this pizza.'}</p>
            <small>{new Date(review.createdAt).toLocaleDateString()}</small>
          </article>
        ))}
      </section>
    </section>
  )
}
