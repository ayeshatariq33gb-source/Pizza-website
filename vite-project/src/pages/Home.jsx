import Hero from '../components/Hero'
import Ticker from '../components/Ticker'
import PizzaMenu from '../components/PizzaMenu'
import Offers from '../components/Offers'
import { AboutStory, WhyChooseUs } from '../components/About'
import Reviews from '../components/Reviews'
import Delivery from '../components/Delivery'
import Contact from '../components/Contact'

export default function Home({ addItem, navigate }) {
  return <><Hero navigate={navigate} /><Ticker /><PizzaMenu onAdd={addItem} navigate={navigate} compact /><Offers onAdd={addItem} /><AboutStory /><WhyChooseUs /><Reviews /><Delivery navigate={navigate} /><Contact /></>
}
