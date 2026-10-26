import { useDispatch } from 'react-redux'
import { CATEGORIES, STORE_NAME } from '../data/products'
import { setCategory } from '../redux/actions/uiActions'
import { HeartIcon, SouqMark } from './Icons'

export default function Footer() {
  const dispatch = useDispatch()

  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div className="footer-brand">
          <p className="logo footer-logo">
            <SouqMark width={24} height={24} />
            <span>Souq<span className="logo-dz">DZ</span></span>
          </p>
          <p>
            A marketplace for every souk need — electronics, fashion, home and beauty,
            delivered across Algeria with cash on delivery.
          </p>
        </div>

        <div>
          <p className="footer-title">Departments</p>
          <ul>
            {CATEGORIES.map((department) => (
              <li key={department}>
                <a href="#catalog" onClick={() => dispatch(setCategory(department))}>{department}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="footer-title">Customer care</p>
          <ul>
            <li><a href="#catalog">Delivery &amp; returns</a></li>
            <li><a href="#catalog">Payment on delivery</a></li>
            <li><a href="#catalog">Contact us</a></li>
            <li><HeartIcon /> <a href="#catalog">Saved items</a></li>
          </ul>
        </div>

        <div>
          <p className="footer-title">SouqDZ</p>
          <ul>
            <li>ENSTA, Cheraga — Algiers</li>
            <li>contact@souqdz.dz</li>
            <li>+213 555 01 02 03</li>
          </ul>
        </div>
      </div>

      <div className="container footer-bottom">
        © {new Date().getFullYear()} {STORE_NAME} — React + Redux lab project (WAMD · TP2).
      </div>
    </footer>
  )
}
