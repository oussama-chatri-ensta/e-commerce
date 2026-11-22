import { useDispatch, useSelector } from 'react-redux'
import { STORE_NAME } from '../data/products'
import {
  openAuthModal,
  openCart,
  openFavorites,
  openProductForm,
  setSearch,
  showToast,
  toggleTheme,
} from '../redux/actions/uiActions'
import { logout } from '../redux/actions/authActions'
import {
  SouqMark,
  HeartIcon,
  MoonIcon,
  SearchIcon,
  SunIcon,
  CartIcon,
  UserIcon,
  PlusIcon,
} from './Icons'

export default function Header() {
  const dispatch = useDispatch()
  const search = useSelector((state) => state.ui.search)
  const theme = useSelector((state) => state.ui.theme)
  const token = useSelector((state) => state.auth.token)
  const user = useSelector((state) => state.auth.user)
  const cartCount = useSelector((state) =>
    state.cart.items.reduce((total, item) => total + item.qty, 0),
  )
  const favoritesCount = useSelector((state) => state.favorites.length)

  const handleLogout = () => {
    dispatch(logout())
    dispatch(showToast('Logged out successfully', 'info'))
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <a className="logo" href="#catalog" aria-label={`${STORE_NAME} home`}>
          <span className="logo-badge" aria-hidden="true">
            <SouqMark width={20} height={20} />
          </span>
          <span className="logo-name">
            Souq<span className="logo-dz">DZ</span>
          </span>
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
          {token ? (
            <div className="auth-bar">
              <button
                type="button"
                className="btn-admin-add"
                onClick={() => dispatch(openProductForm())}
                aria-label="Add new product"
                title="Add product to MongoDB"
              >
                <PlusIcon />
                <span>Add product</span>
              </button>
              <div className="user-pill" title={`Signed in as ${user?.email || ''}`}>
                <UserIcon />
                <span>{user?.name ? user.name.split(' ')[0] : 'Admin'}</span>
              </div>
              <button
                type="button"
                className="btn-logout"
                onClick={handleLogout}
                aria-label="Log out"
              >
                Log out
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="btn-signin"
              onClick={() => dispatch(openAuthModal())}
              aria-label="Sign in"
            >
              <UserIcon />
              <span>Sign in</span>
            </button>
          )}

          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(openFavorites())}
            aria-label={`Open favourites, ${favoritesCount} saved`}
          >
            <HeartIcon filled={favoritesCount > 0} />
            {favoritesCount > 0 && (
              <span className="cart-count fav-count">{favoritesCount}</span>
            )}
          </button>

          <button
            type="button"
            className="icon-btn"
            onClick={() => dispatch(toggleTheme())}
            aria-label={
              theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'
            }
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
