import { useDispatch, useSelector } from 'react-redux'
import { STORE_NAME } from '../data/products'
import { openCart, openFavorites, setSearch, toggleTheme } from '../redux/actions/uiActions'
import { SouqMark, HeartIcon, MoonIcon, SearchIcon, SunIcon, CartIcon } from './Icons'

export default function Header() {
  const dispatch = useDispatch()
  const search = useSelector((state) => state.ui.search)
  const theme = useSelector((state) => state.ui.theme)
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.qty, 0),
  )
  const favoritesCount = useSelector((state) => state.favorites.length)

  return (
    <header className="site-header">
      <div className="container header-row">
        <a className="logo" href="#catalog" aria-label={`${STORE_NAME} home`}>
          <span className="logo-badge" aria-hidden="true"><SouqMark width={20} height={20} /></span>
          <span className="logo-name">Souq<span className="logo-dz">DZ</span></span>
        </a>

        <div className="header-search">
          <SearchIcon />
          <input
            type="search"
            placeholder="Search the souq…"
            aria-label="Search products"
            value={search}
            onChange={(event) => dispatch(setSearch(event.target.value))}
          />
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(openFavorites())}
            aria-label={`Open favourites, ${favoritesCount} saved`}
          >
            <HeartIcon filled={favoritesCount > 0} />
            {favoritesCount > 0 && <span className="cart-count fav-count">{favoritesCount}</span>}
          </button>
          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(toggleTheme())}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
          <button
            type="button"
            className="icon-btn cart-open"
            onClick={() => dispatch(openCart())}
            aria-label={`Open cart, ${cartCount} items`}
          >
            <CartIcon />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
        </div>
      </div>
    </header>
  )
}
