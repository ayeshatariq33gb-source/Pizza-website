import { imageUrl } from '../data/pizzas'
import Icon from './Icon'

export default function PizzaCard({ pizza, onAdd, onView }) {
  return (
    <article className="product-card">
      <div className="product-image-wrap">
        <img className="product-image" src={imageUrl(pizza.image, 720)} alt={`${pizza.name} pizza`} loading="lazy" />
        <span className="product-tag">{pizza.tag}</span><span className="rating"><span>★</span> {pizza.rating}</span>
      </div>
      <div className="product-info"><div className="product-title-row"><h3>{onView ? <button className="pizza-title-link" type="button" onClick={() => onView(pizza)}>{pizza.name}</button> : pizza.name}</h3><strong>${pizza.price}</strong></div><p>{pizza.description}</p><button className="add-button" type="button" onClick={() => onAdd(pizza)}><Icon name="plus" size={17} /> Add to order</button></div>
    </article>
  )
}
