import { useDispatch } from 'react-redux'
import products from '../data/products'
import { CATEGORIES } from '../data/products'
import { setCategory, setSort } from '../redux/actions/uiActions'
import { TruckIcon, RefreshIcon, ShieldIcon } from './Icons'

const SHOWCASE_IDS = ['p123', 'p190', 'p88', 'p203', 'p95', 'p215']

export default function Hero() {
  const dispatch = useDispatch()

  const faces = SHOWCASE_IDS
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const showDeals = () => {
    dispatch(setCategory('All'))
    dispatch(setSort('discount'))
  }

  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <span className="hero-pill">Cash on delivery, all 58 wilayas</span>
          <h1>Everything you need, one souq.</h1>
          <p className="hero-lede">
            {products.length} hand-picked products across {CATEGORIES.length} departments —
            electronics, fashion, home &amp; living, beauty and sports gear,
            with a 7-day money-back guarantee.
          </p>
          <div className="hero-actions">
            <a className="btn primary" href="#catalog">Start shopping</a>
            <button type="button" className="btn ghost" onClick={showDeals}>
              Today&rsquo;s deals
            </button>
          </div>
        </div>
        <div className="hero-side">
          <div className="hero-stage" aria-hidden="true">
            <div className="hero-ring">
              {faces.map((p, i) => (
                <img
                  key={p.id}
                  className="hero-face"
                  src={p.thumbnail}
                  alt=""
                  style={{ transform: `rotateY(${(360 / faces.length) * i}deg) translateZ(var(--ring-radius))` }}
                />
              ))}
            </div>
          </div>
          <ul className="hero-perks">
            <li>
              <TruckIcon />
              <div><strong>48h delivery</strong><span>in Algiers &amp; Oran</span></div>
            </li>
            <li>
              <RefreshIcon />
              <div><strong>7-day returns</strong><span>no questions asked</span></div>
            </li>
            <li>
              <ShieldIcon />
              <div><strong>Pay on delivery</strong><span>check your order first</span></div>
            </li>
          </ul>
        </div>
      </div>
    </section>
  )
}
