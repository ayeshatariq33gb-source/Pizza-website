import ContactSection from '../components/Contact'
import Delivery from '../components/Delivery'

export default function Contact({ navigate }) {
  return <><div className="page-intro"><span className="eyebrow">WE’RE RIGHT AROUND THE CORNER</span><h1>Come as <em>you are.</em></h1><p>Questions, cravings, or just passing by. There’s always room at our table.</p></div><ContactSection /><Delivery navigate={navigate} /></>
}
