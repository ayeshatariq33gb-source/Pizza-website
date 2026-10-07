import { imageUrl } from '../data/pizzas'
import SectionHeading from './SectionHeading'
import useSiteContent from '../hooks/useSiteContent'

export function AboutStory() {
  const about = useSiteContent()?.about
  return <section className="story-section section-pad" id="story"><div className="story-image"><img src={imageUrl(about?.image || 'photo-1556909114-f6e7ad7d3136', 1000)} alt={about?.imageAlt || 'A cook preparing fresh ingredients in the kitchen'} loading="lazy" /><span className="image-caption">{about?.caption || ''}</span></div><div className="story-copy"><span className="eyebrow">{about?.eyebrow || ''}</span><h2>{about?.title || ''}</h2>{about?.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}<a href="#contact" className="text-link text-link--dark">Come say hello <span>↗</span></a></div></section>
}

export function WhyChooseUs() {
  const about = useSiteContent()?.about
  const values = about?.values?.map((value) => value.split('|')) || []
  return <section className="values-section section-pad"><div className="content-width"><SectionHeading eyebrow={about?.valuesEyebrow || ''} title={about?.valuesTitle || ''} /><div className="values-grid">{values.map(([number, icon, title, description]) => <article className="value-item" key={number}><span className="value-number">{number}</span><div className="value-icon">{icon}</div><h3>{title}</h3><p>{description}</p></article>)}</div></div></section>
}
