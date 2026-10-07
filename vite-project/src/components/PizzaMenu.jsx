import { useEffect, useState } from 'react'
import { api } from '../lib/api'
import PizzaCard from './PizzaCard'
import SectionHeading from './SectionHeading'

export default function PizzaMenu({ onAdd, navigate, compact = false }) {
  const [category, setCategory] = useState('All pizzas')
  const [pizzas, setPizzas] = useState([])
  const [categories, setCategories] = useState(['All pizzas'])
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      api.pizzas({ category, search: search.trim() })
      .then((result) => {
        setPizzas(result.pizzas)
        setCategories(['All pizzas', ...result.categories])
      })
      .catch((requestError) => setError(requestError.message))
    }, 250)
    return () => window.clearTimeout(timeout)
  }, [category, search])

  const visiblePizzas = compact ? pizzas.slice(0, 3) : pizzas

  return (
    <section className="menu-section section-pad" id="menu"><div className="content-width"><SectionHeading eyebrow="A menu worth staying in for" title={<>Meet your <em>new favorite.</em></>} detail="Thoughtful toppings, no shortcuts. Find your usual, or let us surprise you." />{!compact && <label className="menu-search">Search the menu<input type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Pizza, topping, or category" /></label>}<div className="category-tabs" role="tablist" aria-label="Pizza categories">{categories.map((item) => <button key={item} type="button" role="tab" aria-selected={category === item} className={category === item ? 'category-tab is-active' : 'category-tab'} onClick={() => setCategory(item)}>{item}</button>)}</div>{error && <p role="alert">{error}</p>}<div className="product-grid">{visiblePizzas.map((pizza) => <PizzaCard key={pizza.id} pizza={pizza} onAdd={onAdd} onView={navigate ? (item) => navigate(`/pizza/${item.id}`) : undefined} />)}</div>{!pizzas.length && !error && <p>Loading today’s menu...</p>}{!pizzas.length && !error && search && <p>No pizzas match that search.</p>}{compact ? <a className="menu-link" href="/menu" onClick={(event) => { event.preventDefault(); navigate('/menu') }}>That’s not all <span>Explore the full menu <span aria-hidden="true">→</span></span></a> : <p className="menu-note">Every pizza is made fresh to order. Gluten-free crust available.</p>}</div></section>
  )
}
