import { AboutStory, WhyChooseUs } from '../components/About'
import Reviews from '../components/Reviews'
import Delivery from '../components/Delivery'
import useSiteContent from '../hooks/useSiteContent'

export default function About({ navigate }) {
  const about = useSiteContent()?.about
  return <><div className="page-intro"><span className="eyebrow">{about?.eyebrow || ''}</span><h1>{about?.title || ''}</h1><p>{about?.paragraphs?.[0] || ''}</p></div><AboutStory /><WhyChooseUs /><Reviews /><Delivery navigate={navigate} /></>
}
