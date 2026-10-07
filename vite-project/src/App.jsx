import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { CartProvider } from './context/CartProvider'
import useCart from './hooks/useCart'
import Home from './pages/Home'
import Menu from './pages/Menu'
import About from './pages/About'
import Contact from './pages/Contact'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Account from './pages/Account'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import PizzaDetails from './pages/PizzaDetails'
import './styles/site.css'

function SiteApp() {
  const [route, setRoute] = useState(window.location.pathname)
  const [notice, setNotice] = useState('')
  const { addItem } = useCart()

  useEffect(() => {
    function syncRoute() {
      setRoute(window.location.pathname)
    }
    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [route])

  function navigate(path) {
    if (path !== window.location.pathname) window.history.pushState({}, '', path)
    setRoute(path)
  }

  function notify(message) {
    setNotice(message)
    window.setTimeout(() => setNotice(''), 2800)
  }

  function addPizza(pizza) {
    addItem(pizza).catch((error) => notify(error.message))
  }

  let page
  switch (route) {
    case '/menu': page = <Menu addItem={addPizza} navigate={navigate} />; break
    case '/about': page = <About navigate={navigate} />; break
    case '/contact': page = <Contact navigate={navigate} />; break
    case '/cart': page = <Cart navigate={navigate} notify={notify} />; break
    case '/login': page = <Login notify={notify} navigate={navigate} />; break
    case '/account': page = <Account notify={notify} navigate={navigate} />; break
    case '/admin/login': page = <AdminLogin navigate={navigate} />; break
    case '/admin': page = <AdminDashboard navigate={navigate} />; break
    default: page = route.startsWith('/pizza/') ? <PizzaDetails id={route.split('/')[2]} addItem={addPizza} navigate={navigate} /> : <Home addItem={addPizza} navigate={navigate}>
    </Home>
  }

  if (route.startsWith('/admin')) return page
  return <><Navbar route={route} navigate={navigate} /><main key={route}>{page}</main><Footer navigate={navigate} />{notice && <div className="toast" role="status"><span>✓</span>{notice}<button type="button" aria-label="Dismiss notification" onClick={() => setNotice('')}>×</button></div>}</>
}

export default function App() {
  return <CartProvider><SiteApp /></CartProvider>
}
