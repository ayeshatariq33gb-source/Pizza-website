import PizzaMenu from '../components/PizzaMenu'
import Offers from '../components/Offers'

export default function Menu({ addItem, navigate }) {
  return <><div className="page-intro"><span className="eyebrow">FRESH FROM OUR OVEN</span><h1>Pizza, <em>your way.</em></h1><p>Made by hand, topped with the good stuff, ready when you are.</p></div><PizzaMenu onAdd={addItem} navigate={navigate} /><Offers onAdd={addItem} /></>
}
