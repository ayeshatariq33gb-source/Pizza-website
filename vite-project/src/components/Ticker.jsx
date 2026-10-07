export default function Ticker() {
  const phrases = ['Long-fermented dough', 'Local, seasonal produce', 'San Marzano tomatoes', 'Always made by hand']
  return <div className="ticker" aria-label="Our ingredients"><div className="ticker-track">{[...phrases, ...phrases].map((phrase, index) => <span className="ticker-item" key={`${phrase}-${index}`}>{phrase}<i>✳</i></span>)}</div></div>
}
